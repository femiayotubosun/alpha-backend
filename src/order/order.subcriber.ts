import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemRepository } from './order-item.repository';
import { OrderRepository } from './order.repository';

const orderRepository = new OrderRepository();

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<OrderItem> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return OrderItem;
  }

  /**
   * Called before OrderItem insertion.
   */
  //   afterInsert(event: InsertEvent<OrderItem>) {
  //     const order = event.entity.order;
  //     order.price =
  //       order.price + event.entity.product.price * event.entity.quantity;

  //     orderRepository.save(order);
  //   }
}
