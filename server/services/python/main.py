from flask import Flask,jsonify,make_response, redirect, request, url_for,current_app
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'ecommercejs'

mysql = MySQL(app)

@app.route('/', methods=['GET'])
def index():
    return 'Flask'
def branch_and_bound(current_item, temporary_highest_price, user_balance_calculating, products, quantity_storage, total_value, upper_bound, products_length):
    maximum_product_can_buy = min(
        user_balance_calculating / products[current_item][4], 1)
    for t in range(int(maximum_product_can_buy), -1, -1):
        total_value = total_value + t * products[current_item][2]
        user_balance_calculating = user_balance_calculating - t * products[current_item][4]
        if current_item != len(products) - 1:
            upper_bound = total_value + user_balance_calculating * products[current_item + 1][5]
        if upper_bound > temporary_highest_price:
            quantity_storage[current_item] = t
            if current_item == len(products) - 1 or user_balance_calculating <= 0.0:
                temporary_highest_price = update_temporary_best_choice(products, quantity_storage, total_value, temporary_highest_price, products_length)
            else:
                temporary_highest_price = branch_and_bound(current_item + 1, temporary_highest_price, user_balance_calculating, products, quantity_storage, total_value, upper_bound, products_length)
        quantity_storage[current_item] = 0
        total_value = total_value - t * products[current_item][2]
        user_balance_calculating = user_balance_calculating + t * products[current_item][4]
    return temporary_highest_price

def update_temporary_best_choice(products, quantity_storage, total_value,temporary_highest_price, products_length):
    if (temporary_highest_price < total_value):
        temporary_highest_price = total_value
        for current_item in range(0, products_length, 1):
            products[current_item][6] = quantity_storage[current_item]
    return temporary_highest_price

@app.route('/calculate/<user_id>',methods=['GET'])
def calculate(user_id):
    try:
        print(user_id)
        cursor = mysql.connection.cursor()
        cursor.execute("select balance from users where visible_id = '"+str(user_id)+"'")
        user = cursor.fetchall()
        cursor.execute("select visible_id, title, price,sale_percent from products where on_sale = 1 and is_active=1 order by sale_percent")
        products = cursor.fetchall()
        cursor.close()
        if not user:
            response = make_response(
                jsonify(
                    {"message": "User not found","success":False}
                ),
                404,
            )
            return response
        user_balance = user[0][0]
        total_value = 0
        user_balance_calculating = user_balance
        temporary_highest_price = 0
        products = list(products)
        products_length = len(products)    
        quantity_storage = []
        for index in range(0, products_length, 1):
            quantity_storage.append(0)
            products[index] = list(products[index])
            current_price = products[index][2]*(100-products[index][3])/100
            products[index].append(current_price)
            value = products[index][2]/products[index][4]
            products[index].extend([value,0])
        print(products)
        for first_index in range(0,products_length-1,1):
            for second_index in range(first_index+1,products_length,1):
                if(products[first_index][3] < products[second_index][3]):
                    temp = products[first_index]
                    products[first_index] = products[second_index]
                    products[second_index] = temp
        upper_bound = user_balance * (products[0][3] / 100)
        branch_and_bound(0, temporary_highest_price, user_balance_calculating, products, quantity_storage, total_value, upper_bound, products_length)
        print(products)
        if(len(products) > 0):
            response = make_response(
                jsonify(
                    {"message": "success","success":True,"data":products}
                ),
                200,
            )
        else:
            response = make_response(
                jsonify(
                    {"message": "Not found","success":False}
                ),
                400,
            )
        response.headers["Content-Type"] = "application/json"
        return response
    except:
        response = make_response(
            jsonify(
                {"message": "Internal server failed","success":False}
            ),
            500,
        )
        return response
if __name__ == '__main__':
    app.run(debug=True)