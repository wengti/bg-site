try {

        // Ideally the stripeToken should be created from the card information
        // const stripeToken = await stripe.tokens.create({card})
        
        // For testing, using prebuilt visa tokens provided by Stripe
        const stripeToken = 'tok_visa' 



        // Create stripe customer
        const stripeCustomer = await stripe.customers.create({
            name: 'Weng Ti',
            email: 'wengti@hotmail.com',
            source: stripeToken // Replace this with stripeToken.id
            // Feel free to add on more objects
        })

        // Create Stripe Charge
        const stripeCharge = await stripe.charges.create({
            amount: price * 100, //Process in the smallest unit of the currency
            currency: 'MYR',
            customer: stripeCustomer.id,
            description: `Order: ${orderId} for ${price}`
        })

        return res.json({
            message: 'Payment was successful.',
            charge: stripeCharge
        })
    }
    catch (err) {
        const name = 'Server side error.'
        const message = 'Server side error.'
        return res.status(500).json({ name, message })
    }