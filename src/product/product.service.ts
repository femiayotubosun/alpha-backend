import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }

  getProducts(filterDto: GetProductsFilterDto): Promise<Product[]> {
    return this.productRepository.getProducts(filterDto);
  }

  getProductById(id: string) {
    return this.productRepository.getProductById(id);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);

    const { name, price, stock } = updateProductDto;
    console.log(name, price, stock);

    if (name) {
      product.name = name;
    }

    if (price) {
      product.price = price;
    }

    if (stock) {
      product.stock = stock;
    }

    await this.productRepository.save(product);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
  }
}
