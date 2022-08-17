using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Services;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Stripe;
using API.Entities.OrderAggregrate;

namespace API.Controllers
{
    public class PaymentsController: BaseApiController
    {
        private readonly PaymentService _paymentService;
        private readonly StoreContext _context;
        private readonly IConfiguration _config;

        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config) 
        {
            _paymentService = paymentService;
            _context = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDTO>> CreateOrUpdatePaymentIntent()
        {
           var basket = await _context.Baskets
                            .RetrieveBasketWithItems(User.Identity.Name)
                            .FirstOrDefaultAsync();
            
            if(basket == null) return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);
            
            if(intent == null) return BadRequest(new ProblemDetails{Title = "Problem in creating payment intent."}); 

            basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;
            _context.Update(basket);

            var result = await _context.SaveChangesAsync();
            if(result <= 0) return BadRequest(new ProblemDetails{Title = "Problem updating basket with intent"});

            return basket.MapBasketToDTO();
        }

        // this api is called by stripe webhook to update payment status.
        // $stripe login
        // get the web hook secret and update it in the appsettings.json file
        // $stripe listen -f http://localhost:5000/api/payments/webhook -e charge.succeeded
        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWeebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            
            var striptEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
                                _config["StripeSettings:WebHookSecret"]);

            var charge = (Charge) striptEvent.Data.Object;

            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);
            if(charge.Status == "succeeded") 
            {
                order.OrderStatus = OrderStatus.PaymentReceived;
                await _context.SaveChangesAsync(); 
            }

            return new EmptyResult();   
        }
    }
}