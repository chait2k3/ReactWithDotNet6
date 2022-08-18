using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Authorization;
using API.DTOs;
using AutoMapper;
using API.Services;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly ILogger<ProductsController> _logger;
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        public ProductsController(
            StoreContext context, 
            IMapper mapper, 
            ImageService imageService,
            ILogger<ProductsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
            _logger = logger;
        }

        [HttpGet]  // api/products
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productPatams)
        {
            // create a query for searching, sorting, filtering and pagination.
            var query = _context.Products
                    .Sort(productPatams.OrderBy)
                    .Search(productPatams.SearchTerm)
                    .Filter(productPatams.Brands, productPatams.Types)
                    .AsQueryable();
            
            var products = await PagedList<Product>.ToPagedList(query, productPatams.PageNumber, productPatams.PageSize);
            
            Response.AddPaginationHeader(products.MetaData);

            if(products == null) return NotFound();
            return products;
        }

        [HttpGet("{id}", Name = "GetProduct")]  // api/products/3
        public async Task<ActionResult<Product>> GetProduct(int id) 
        {
            var product = await _context.Products.FindAsync(id);
            if(product == null) return NotFound();
            return Ok(product);
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();
            
            return Ok(new { brands, types });
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm]CreateProductDTO productDTO)
        {
            var product = _mapper.Map<Product>(productDTO);

            if(productDTO.File != null) 
            {
                var imageResult = await _imageService.AddImageAsync(productDTO.File);
                
                if(imageResult.Error != null) {
                    return BadRequest(new ProblemDetails{ Title = imageResult.Error.Message});
                }

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;                
            }

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync();

            if(result > 0) return CreatedAtRoute("GetProduct", new {Id = product.Id}, product);

            return BadRequest(new ProblemDetails{ Title = "Problem creating new product."});
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm]UpdateProductDTO productDTO)
        {
            var product = await _context.Products.FindAsync(productDTO.Id);
            
            if(product == null) return NotFound();

            _mapper.Map(productDTO, product);

            if(productDTO.File != null) 
            {
                var imageResult = await _imageService.AddImageAsync(productDTO.File);
                
                if(imageResult.Error != null) {
                    return BadRequest(new ProblemDetails{ Title = imageResult.Error.Message});
                }
                
                if(!string.IsNullOrEmpty(product.PublicId)) 
                {
                    await _imageService.DeleteImageAsync(product.PublicId);
                }

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;                
            }

            var result = await _context.SaveChangesAsync();

            if(result > 0) return Ok(product);

            return BadRequest(new ProblemDetails{ Title = "Problem updating product."});
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            
            if(product == null) return NotFound();

            if(!string.IsNullOrEmpty(product.PublicId)) 
            {
                await _imageService.DeleteImageAsync(product.PublicId);
            }

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync();

            if(result > 0) return Ok();

            return BadRequest(new ProblemDetails{ Title = "Problem deleting product."});
        }

    }
}