const dotenv = require(`dotenv`);
dotenv.config();
const mongoose = require(`mongoose`);
const prompt = require('prompt-sync')();


const Users = require(`./models/users`)


const connectToDatabase = async () => {
    await mongoose.connect(process.env.MONGODB_URI);


const usersChoice = prompt(`
    What would you like to do?
    
        1. Create a customer
        2. View all Customers
        3. Update a customer
        4. Delete a customer
        5 quit
    
    Number of action to run:
    `);
    console.log(`User picked: ${usersChoice}`);

    if (input === `1`) {
        await createNewCustomer();
    } else if (input === `2`) {
        await viewAllCustomers();
    } else if (input === `3`) {
        await updateExistingCustomer();
    } else if (input === `4`) {
        await deleteExistingCustomer();
    } else if (input === `5`) {
        await quitProgram();
    } else {
        console.log("Invalid choice. Please select a valid option.");
    }
}


const welcomeLabel = `
 _ _ _ _ _ _ _ _ _ _ _ _ _    
|                         |
|    Welcome to the CRM   |
|_ _ _ _ _ _ _ _ _ _ _ _ _|

`;


console.log(welcomeLabel)
connectToDatabase();



const createNewCustomer = async () => {
    const name = prompt(`What is your name?`);
    const age = prompt(`What is your age?`);
    const newCustomer = {
        name: name,
        age: age
    };

    connectToDatabase();
    await Users.create(newCustomer);
    console.log(`Hello, ${newCustomer.name}! You have been successfully add to the CRM!`);
};




const viewAllCustomers = async () => {
    await connectToDatabase();
    const existingCustomers = await Users.find();

    console.log(`Below is a list of all the customers:`);
    console.log(``);

    existingCustomers.forEach(customer => {
        console.log(`ID: ${customer.id}, Name: ${customer.name}, Age: ${customer.age}`);
    });
}




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
    await connectToDatabase();
    
    await viewAllCustomers();

    const selectedCustomer = prompt(`Copy and paste the id of the customer you would like to remove here:`);

    const result = await Users.findByIdAndDelete(selectedCustomer);

    if (result) {
        console.log(`Customer with ID: ${selectedCustomer} has been successfully removed.`);
    } else {
        console.log(`No customer found with ID: ${selectedCustomer}.`);
    }

    mongoose.connection.close();
}




const quitProgram = async () => {
    console.log(`Exiting...`);
    mongoose.connection.close();
}




// createNewCustomer();
// viewAllCustomers();
// updateExistingCustomer();
// deleteExistingCustomer();
// quitProgram()