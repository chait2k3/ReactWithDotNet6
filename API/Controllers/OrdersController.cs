using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities.OrderAggregrate;
using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.Entities;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController: BaseApiController
    {
        private readonly StoreContext _context;
    
        public OrdersController(StoreContext context)
        {
            _context = context;
        }  

        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders()
        {
            return await _context.Orders
                    .ProjectOrderToOrderDTO()
                    .Where(x => x.BuyerId == User.Identity.Name)
                    .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            return await _context.Orders
                    .ProjectOrderToOrderDTO()
                    .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                    .FirstOrDefaultAsync();
        }
        
        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDTO orderDTO)
        {
            // get current user's basket
            var basket = await _context.Baskets
                            .RetrieveBasketWithItems(User.Identity.Name)
                            .FirstOrDefaultAsync();
            
            if(basket == null) return BadRequest(new ProblemDetails{Title = "Could not locate basket."});

            // build order item list
            var orderItems = new List<OrderItem>();
            foreach(var basketItem in basket.Items)
            {
                // get the product
                var productItem = await _context.Products.FindAsync(basketItem.ProductId);
                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };

                //create order item
                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = basketItem.Qyantity
                };

                orderItems.Add(orderItem);
                
                // reduct product quantity
                productItem.QuantityInStock -= orderItem.Quantity;
            }

            // calculate total amout
            var subTotal = orderItems.Sum(i => i.Price * i.Quantity);
            var deliveryFee = subTotal >= 10000 ? 0 : 500;

            // create order
            var order = new Order
            {
                BuyerId = User.Identity.Name,
                OrderItems = orderItems,
                ShippingAddress = orderDTO.ShippingAddress,
                SubTotal = subTotal,
                DeliveryFee = deliveryFee,
                PaymentIntentId = basket.PaymentIntentId
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            // save user address
            if(orderDTO.SaveAddress)
            {
                var user = await _context.Users
                                .Include(a => a.Address)
                                .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                var address = new UserAddress
                {
                    FullName = orderDTO.ShippingAddress.FullName,
                    Address1 = orderDTO.ShippingAddress.Address1,
                    Address2 = orderDTO.ShippingAddress.Address2,
                    State = orderDTO.ShippingAddress.State,
                    City = orderDTO.ShippingAddress.City,
                    Zip = orderDTO.ShippingAddress.Zip,
                    Country = orderDTO.ShippingAddress.Country
                }; 
                user.Address = address;
                _context.Update(user);
            }

            var result = await _context.SaveChangesAsync();
            if(result > 0) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

            return BadRequest("Problem creating order");
        }

    }
}