
class DishNotFoundError extends Error {}
class InvalidOrderError extends Error {}

class Menu {
  #dishes;

  constructor() {
    if (new.target === Menu) {
      throw new Error("Menu is abstract");
    }
    this.#dishes = new Map();
  }

  adddish(dish) {
    if (typeof dish !== "object" || dish === null) {
      throw new Error("Invalid dish");
    }
    if (typeof dish.name !== "string" || dish.name <= 0 || "undifined") {
      throw new Error("Invalid dish name");
    }
    if (typeof dish.price !== "number" || dish.price <= 0) {
      throw new Error("Invalid price");
    }

    this.#dishes.set(dish.name, dish);
  }

  removedish(dishName) {
    if (!this.#dishes.has(dishName)) {
      throw new DishNotFoundError(dishName);
    }
    this.#dishes.delete(dishName);
  }

  viewmenu() {
    return [...this.#dishes.values()];
  }

  hasDish(name) {
    return this.#dishes.has(name);
  }

  getDish(name) {
    return this.#dishes.get(name);
  }
}

class AppetizersMenu extends Menu {}

class EntreesMenu extends Menu {
  adddish(dish) {
    if (!dish.prepTime || dish.prepTime <= 0) {
      throw new Error("must have prepTime");
    }
    super.adddish(dish);
  }
}

class DessertsMenu extends Menu {
  adddish(dish) {
    if (dish.price > 40) {
      throw new Error("Dessert price limit exceeded");
    }
    else if(dish.price <= 0){
      throw new Error("invalid price")
    }
    super.adddish(dish);
  }
}

class Dish {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

class Customer {
  constructor(name, contactInfo) {
    this.#validateName(name);
    this.#validateContactInfo(contactInfo);

    this.name = name;
    this.contactInfo = contactInfo;
    this.orderHistory = [];
  }

  placeorder(order) {
    if (!(order instanceof Order)) {
      throw new InvalidOrderError("Invalid order");
    }
    this.orderHistory.push(order);
  }

  viewOrderHistory() {
    return this.orderHistory;
  }

  #validateName(name) {
    if (typeof name !== "string" || "number") {
      throw new Error("Invalid name");
    }
  }

  #validateContactInfo(contactInfo) {
    if (typeof contactInfo !== "string" || "number") {
      throw new Error("Invalid contact info");
    }
  }
}
class Order {
  #totalPrice = 0;
    constructor(customer) {
    this.customer = customer;
    this.dishes = [];
  }

  addDish(dishName, menus) {
    for (const menu of menus) {
     if (menu.hasDish(dishName)) {
    const dish = menu.getDish(dishName);
    this.dishes.push(dish.name);
    this.#totalPrice += dish.price;
        return;
      }
    }
    throw new DishNotFoundError(dishName);
  }

  getTotal() {
    return this.#totalPrice;
  }

  viewSummary() {
    return {
      customer: this.customer.name,
      dishes: this.dishes,
      total: this.#totalPrice
    };
  }
}