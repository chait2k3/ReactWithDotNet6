using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.OrderAggregrate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDTO> ProjectOrderToOrderDTO(this IQueryable<Order> query)
        {
            return query
                    .Select(order => new OrderDTO
                    {
                        Id = order.Id,
                        BuyerId = order.BuyerId,
                        ShippingAddress = order.ShippingAddress,
                        OrderDate = order.OrderDate,
                        SubTotal = order.SubTotal,
                        DeliveryFee = order.DeliveryFee,
                        OrderStatus = order.OrderStatus.ToString(),
                        Total = order.GetTotal(),
                        OrderItems = order.OrderItems.Select(item => new OrderItemDTO
                        {
                            ProductId = item.ItemOrdered.ProductId,
                            Name = item.ItemOrdered.Name,
                            PictureUrl = item.ItemOrdered.PictureUrl,
                            Quantity = item.Quantity,                   
                            Price = item.Price
                        }).ToList()
                    }).AsNoTracking();
        }
    }
}