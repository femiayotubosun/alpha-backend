import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products.dto';
import { GetOneResourceParamDto } from './dto/get-one-product.dto';
import { Product } from './entities/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/user-roles.enum';

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/photos');
  },
  filename: function (req, file, callback) {
    console.log(file);
    const splitFilename = file.originalname.split('.');
    const extenstion = splitFilename[splitFilename.length - 1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, 'photo-' + uniqueSuffix + '.' + extenstion);
  },
});

@UseGuards(AuthGuard())
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
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
    @Param() productIdParam: GetOneResourceParamDto,
  ): Promise<Product> {
    const { id } = productIdParam;
    return this.productService.getProductById(id);
  }

  @Post(':id/photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,
    }),
  )
  addProductPhtoto(
    @Param() productIdParam: GetOneResourceParamDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const splitFilename = file.originalname.split('.');
    const extenstion = splitFilename[splitFilename.length - 1];

    const { id } = productIdParam;
    return this.productService.addProductPhoto(id, file.filename);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch(':id')
  updateProduct(
    @Param() productIdParam: GetOneResourceParamDto,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { id } = productIdParam;
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete(':id')
  deleteProduct(
    @Param() productIdParam: GetOneResourceParamDto,
  ): Promise<void> {
    const { id } = productIdParam;
    return this.productService.deleteProduct(id);
  }
}
