using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;
using API.DTOs;

namespace API.Controllers 
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly ILogger<BasketController> _logger;
        public BasketController(StoreContext context, ILogger<BasketController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDTO>> GetBasket()
        {
            Basket basket = await RetriveBasket();

            if (basket == null) return NotFound();
            return MapBasketToDTO(basket);
        }

        [HttpPost] // api/basket?productId=1&quantity=3
        public async Task<ActionResult<BasketDTO>> AddItemToBasket(int productId, int quantity)
        {
            // get basket or create new one
            var basket = await RetriveBasket();
            if(basket == null) basket = CreateBasket();
            
            // get product, return error if not found
            var product = await _context.Products.FindAsync(productId);
            if(product == null) return NotFound();

            // add item to basket and update quantity
            basket.AddItem(product, quantity);

            // save changes to db
            var result = await _context.SaveChangesAsync();
            if(result > 0) return CreatedAtRoute("GetBasket",MapBasketToDTO(basket));

            return BadRequest(new ProblemDetails{Title = "Problem in saving item to basket."});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
        {
            // get basket
            var basket = await RetriveBasket();
            if(basket == null) return NotFound();

            // remove item or reduce quantiry
            basket.RempveItem(productId, quantity);

            // save changes to db
            var result = await _context.SaveChangesAsync();
            if(result > 0) return Ok();

            return BadRequest(new ProblemDetails{Title = "Problem in removing item from basket."});  
        }

        private async Task<Basket> RetriveBasket()
        {
            return await _context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30),
            };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            
            var basket = new Basket{ BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }
        
        private BasketDTO MapBasketToDTO(Basket basket)
        {
            return new BasketDTO
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDTO
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Brand = item.Product.Brand,
                    Type = item.Product.Type,
                    Quantity = item.Qyantity
                }).ToList()
            };
        }


    }
}