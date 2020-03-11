# See https://aka.ms/containerfastmode to understand how Visual Studio uses 
# this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Keycap/Keycap.csproj", "Keycap/"]
RUN dotnet restore "Keycap/Keycap.csproj"
COPY . .
WORKDIR "/src/Keycap"
RUN dotnet build "Keycap.csproj" -c Release -o /app/build

RUN apt-get update -yq
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

FROM build AS publish
RUN dotnet publish "Keycap.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app/ClientApp

WORKDIR /app
COPY --from=publish /app/publish .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet Keycap.dll