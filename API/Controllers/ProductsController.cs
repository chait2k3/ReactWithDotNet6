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

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly ILogger<ProductsController> _logger;
        private readonly StoreContext _context;
        public ProductsController(StoreContext context, ILogger<ProductsController> logger)
        {
            _context = context;
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

        [HttpGet("{id}")]  // api/products/3
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
    }
}