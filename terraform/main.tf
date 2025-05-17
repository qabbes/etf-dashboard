module "scraped_etf_data" {
  source      = "./modules/s3"
  bucket_name = "scraped-etf-data-qabbes"
  
}