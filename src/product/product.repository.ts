import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products.dto';
import { Product } from './entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, price, stock } = createProductDto;

    const product = this.create({
      name,
      price,
      stock,
    });

    try {
      await this.save(product);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
    return product;
  }

  async getProducts(filterDto: GetProductsFilterDto): Promise<Product[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('product');

    if (search) {
      query.andWhere('(LOWER(product.name) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });
    }

    const products = await query.getMany();
    return products;
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} does not exist.`);
    }

    return product;
  }
  async checkAvailabe(id: string, quantity: number): Promise<boolean> {
    const product = await this.getProductById(id);

    if (product.stock - quantity < 0) {
      return false;
    }
    return true;
  }
}
