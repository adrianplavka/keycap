using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;

using Keycap.Models.DAL;

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
                options.UseNpgsql(CreateDatabaseConnectionString()));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
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
                app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                                       .CreateScope())
                    using (var context = scope.ServiceProvider.GetService<KeycapDbContext>())
                    {
                        context.Database.EnsureDeleted();
                        context.Database.EnsureCreated();
                    }
        }

        private static string CreateDatabaseConnectionString()
        {
            var isUri = Uri.TryCreate(
                    Environment.GetEnvironmentVariable("DATABASE_URL"),
                    UriKind.Absolute,
                    out var uri);
            if (!isUri)
                throw new UriFormatException("Cannot deserialize DATABASE_URL environment variable.");

            var builder = new NpgsqlConnectionStringBuilder
            {
                Host = uri.Host,
                Port = uri.Port,
                Username = uri.UserInfo.Contains(":", StringComparison.Ordinal) ? uri.UserInfo.Split(":")[0] : uri.UserInfo,
                Password = uri.UserInfo.Contains(":", StringComparison.Ordinal) ? uri.UserInfo.Split(":")[1] : null,
                Database = uri.LocalPath.TrimStart('/'),
                Pooling = true,
            };

            return builder.ToString();
        }
    }
}
