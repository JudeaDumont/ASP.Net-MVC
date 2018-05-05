using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication2.Controllers
{
    public class HelloWorldController : Controller
    {
        // 
        // GET: /HelloWorld/ 
        public ActionResult Index()
        {
            //return "This is my <b>default</b> action...";
            return View();
        }

        // 
        // GET: /HelloWorld/Welcome/ 

        public ActionResult Welcome(String name = "unknown", int numTimes = 1)
        {
            //return HttpUtility.HtmlEncode("This is the Welcome action method, "+name +" ... \n numtimes = " + numTimes);

            return View();
        }
    }
}