using System;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Keycap.DAL;

namespace Keycap
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddDbContext<KeycapDbContext>(options =>
            {
                var isUrl = Uri.TryCreate(
                    Environment.GetEnvironmentVariable("DATABASE_URL"),
                    UriKind.Absolute,
                    out var url);
                if (!isUrl)
                    throw new UriFormatException("Cannot deserialize DATABASE_URL");

                var connectionString = new StringBuilder();
                connectionString.Append($"host={url.Host};");

                if (url.UserInfo.Contains(":"))
                {
                    connectionString.Append($"username={url.UserInfo.Split(":")[0]};");
                    connectionString.Append($"password={url.UserInfo.Split(":")[1]};");
                }
                else
                {
                    connectionString.Append($"username={url.UserInfo};");
                }

                connectionString.Append($"database={url.LocalPath.Substring(1)};pooling=true;");

                options.UseNpgsql(connectionString.ToString());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            // Initializes the application's database in order to re-create database tables.
            using (var scope =
                app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
                    using (var context = scope.ServiceProvider.GetService<KeycapDbContext>())
                    {
                        // TODO: Delete "EnsureDeleted" call, when done with prototyping.
                        context.Database.EnsureDeleted();
                        context.Database.EnsureCreated();
                    }
        }
    }
}
