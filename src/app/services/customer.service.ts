import {Injectable} from "@angular/core";
import {selectCustomerError, selectCustomerLoading, selectCustomerOrders} from "../store/customer/customer.selectors";
import {CustomerState} from "../store/customer/customer.state";
import {Store} from "@ngrx/store";
import * as CustomerActions from '../store/customer/customer.actions';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private store: Store<CustomerState>) {}

  getCustomerOrdersSignal(customerId: string) {
    this.store.dispatch(CustomerActions.getCustomerOrders({ customerId }));
    return this.store.selectSignal(selectCustomerOrders);
  }

  getCustomerLoadingSignal() {
    return this.store.selectSignal(selectCustomerLoading);
  }

  getCustomerErrorSignal() {
    return this.store.selectSignal(selectCustomerError);
  }

}
