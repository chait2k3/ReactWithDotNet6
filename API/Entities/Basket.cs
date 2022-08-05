using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        public void AddItem(Product product, int quantity) {
            //if product is not already added then add new one else increase quantity
            if(Items.All(item => item.ProductId != product.Id)) 
            {
                Items.Add(new BasketItem {Product = product, Qyantity = quantity});
            }
            else{
                var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
                if(existingItem != null) existingItem.Qyantity += quantity;
            }
        }

        public void RempveItem(int productId, int quantity) 
        {
            var existingItem = Items.FirstOrDefault(item => item.ProductId == productId);
            if(existingItem == null) return;

            existingItem.Qyantity -= quantity;
            if(existingItem.Qyantity == 0) Items.Remove(existingItem);
        }
    }    
}