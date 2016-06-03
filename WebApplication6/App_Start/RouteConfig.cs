using System.Web.Mvc;
using System.Web.Routing;

namespace InsightCounts
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "ReactionTimer",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "ReactionTimer", id = UrlParameter.Optional }
            );
        }
    }
}
