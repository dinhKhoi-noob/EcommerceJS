const renderOrderList = () => {
    const orderListData = JSON.parse(localStorage.getItem('order_list'));
    const orderTable = document.querySelector('#order-list-table');
    const orderListContainer = document.querySelector('#order-list-container');
    if(!orderListData || orderListData.order.length < 1)
    {
        orderListContainer.innerHTML = 'You have not ordered any dish yet';
        return;
    }
    let orderItems = orderListData.order.map((item)=>(
        `<div class="order-list-card">
            <div class="order-list-thumbnail" style="background-image: url('/images/product-images/${item.thumbnail}');">

            </div>
            <div class="order-list-title">
                ${item.title}
            </div>
            <div class="order-list-quantity-section">
                <!-- <i class="fas fa-minus-circle order-list-btn-decrease" id="order-list-btn-decrease_${element.id}"></i> -->
                <i class="fas fa-minus-circle order-list-btn-decrease"></i>
                <div class="order-list-quantity">
                    <input type="text" value="${item.quantity}" class="order-list-quantity-input">
                </div>
                <i class="fas fa-plus-circle order-list-btn-increase"></i>
                <!-- <i class="fas fa-plus-circle order-list-btn-increase" id="order-list-btn-increase_${element.id}"></i> -->
            </div>
            <div class="order-list-price">
                ${item.quantity}
            </div>
            <div class="order-list-total-item-price">
                $${item.quantity*item.price*(100-item.sale_percent)/100}
            </div>
        </div>
        `
    )).join('');
    orderTable = orderItems;
}