const dotenv = require(`dotenv`);
dotenv.config();
const mongoose = require(`mongoose`);
const prompt = require('prompt-sync')();


const Users = require(`./models/users`);


const connectToDatabase = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
};


const welcomeLabel = `
             _ _ _ _ _ _ _ _ _ _ _ _ _    
            |                         |
            |    Welcome to the CRM   |
            |_ _ _ _ _ _ _ _ _ _ _ _ _|

`;


console.log(welcomeLabel);


const createNewCustomer = async () => {
    const name = prompt(`What is your name?`);
    const age = prompt(`What is your age?`);
    const newCustomer = {
        name: name,
        age: age
    };

    await Users.create(newCustomer);
    console.log(`Hello, ${newCustomer.name}! You have been successfully add to the CRM!`);
};




const viewAllCustomers = async () => {
    
    const existingCustomers = await Users.find();

    console.log(`Below is a list of all the customers:`);
    console.log(``);

    existingCustomers.forEach(customer => {
        console.log(`ID: ${customer.id}, Name: ${customer.name}, Age: ${customer.age}`);
    });
};




const updateExistingCustomer = async () => {
    await viewAllCustomers();

    console.log(``);
    const selectedCustomer = prompt(`Copy and paste the id of the customer you would like to update here:`);
    const newName = prompt(`What is the customers new name?`);
    const newAge = prompt(`What is the customers new age?`);

    await Users.findByIdAndUpdate(selectedCustomer, {
        name: newName,
        age: newAge
    });

    mongoose.connection.close();
};




const deleteExistingCustomer = async () => {

    await viewAllCustomers();

    const selectedCustomer = prompt(`Copy and paste the id of the customer you would like to remove here:`);

    const result = await Users.findByIdAndDelete(selectedCustomer);

    if (result) {
        console.log(`Customer with ID: ${selectedCustomer} has been successfully removed.`);
    } else {
        console.log(`No customer found with ID: ${selectedCustomer}.`);
    }
};




const quitProgram = async () => {
    console.log(`Exiting...`);
    mongoose.connection.close();
};




const runProgram = async () => {
    await connectToDatabase()

    while (true) {
        const usersChoice = prompt(`
            What would you like to do?
            
                1. Create a customer
                2. View all Customers
                3. Update a customer
                4. Delete a customer
                5 quit
            
            Number of action to run:
            `);
        
            await connectToDatabase()
        
            if (usersChoice === `1`) {
                await createNewCustomer();
            } else if (usersChoice === `2`) {
                await viewAllCustomers();
            } else if (usersChoice === `3`) {
                await updateExistingCustomer();
            } else if (usersChoice === `4`) {
                await deleteExistingCustomer();
            } else if (usersChoice === `5`) {
                await quitProgram();
                break;
            } else {
                console.log("Invalid choice. Please select a valid option.");
            };   
    };
};

runProgram();


// createNewCustomer();
// viewAllCustomers();
// updateExistingCustomer();
// deleteExistingCustomer();
// quitProgram()