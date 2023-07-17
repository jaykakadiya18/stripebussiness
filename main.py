from flask import Flask, request, render_template, redirect,session, url_for,flash,current_app,make_response
import secrets
import os
import json
import stripe

app = Flask(__name__)

# Route for handling GET requests
@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template("index.html")

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
    return render_template("checkout.html")

@app.route('/info_change', methods=['GET', 'POST'])
def info_change():
    if request.method=="POST":
        firstName = request.form["firstName"]
        lastName = request.form["lastName"]
        email = request.form["email"]
        shippingAddress1 = request.form["shippingAddress1"]
        shippingAddress2 = request.form["shippingAddress2"]
        shippingCity = request.form["shippingCity"]
        shippingCountry = request.form["shippingCountry"]
        shippingState = request.form["shippingState"]
        shippingZip = request.form["shippingZip"]

    return render_template("checkout-now-v2.html")


buplishable_key ='pk_test_BhgKfQXeZ9rPr8oX3j3gRgzK'
stripe.api_key ='sk_test_ts5wfRI0AiWQ9tQW9ASiYHpk'

@app.route('/payment',methods=['POST'])
def payment():
    amount = request.form.get('amount')
    customer = stripe.Customer.create(
      email=request.form['stripeEmail'],
      source=request.form['stripeToken'],
    )
    charge = stripe.Charge.create(
      customer=customer.id,
      description='Myshop',
      amount=int(amount),
      currency='usd',
    )
    return redirect(url_for('thanks'))

@app.route('/thanks')
def thanks():
    return render_template('thank.html')


if __name__ == '__main__':
    app.run()
