import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products.dto';
import { GetOneProductParamDto } from './dto/get-one-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  getProducts(@Query() filterDto: GetProductsFilterDto): Promise<Product[]> {
    return this.productService.getProducts(filterDto);
  }

  @Get(':id')
  getProductById(
    @Param() productIdParam: GetOneProductParamDto,
  ): Promise<Product> {
    const { id } = productIdParam;
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  updateProduct(
    @Param() productIdParam: GetOneProductParamDto,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { id } = productIdParam;
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param() productIdParam: GetOneProductParamDto): Promise<void> {
    const { id } = productIdParam;
    return this.productService.deleteProduct(id);
  }
}
