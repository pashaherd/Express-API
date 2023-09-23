# CSFS1020: Express Todo API  Lab

This lab walks through the setup of a basic RESTful API setup using Express.js and also leveraging esm modules. 

## Setup
1. Make sure you are logged into `github.com` and then click on `New Repository`. Name the repository: `node-express-todo-lab`. Before you proceed, ensure you have checked off the box: `Initialize repository with: Add a README file`. It is suggested to keep this private for now.
2. Clone the repository locally to continue. Create a `.gitignore` file. You may simply include `node_modules` in this file to ignore node, or generate the contents by using the tool found on [gitignore.io](https://gitignore.io)
3. Locally, make sure you in the folder of your repository and then initialize npm: `npm init`. Follow the given prompts. At the end you should have a `package.json` file.
4. Time to install dependencies. The following command will install these dependencies `npm install express --save`:
    - express.js: used to build the API
4. In `package.json` file, be sure to add `"type": "module"`. Be sure to take care to add comma either after or before depending on where you add this line in the JSON file.
5. Create a new file called `index.js`. In this file, we'll add the following code:
```javascript
import express from 'express'
const app = express()
const port = 3000
// allows us to parse json 
app.use(express.json())

app.get('/', (req, res) => res.send('Hello world'))

app.listen(port, () => console.log(`API server ready on http://localhost:${port}`))
```
6. In `package.json`, before the `test` property located inside of the `scripts` property, please add a new property called: `start` that has the value: `node index.js`, e.g.:
```json
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
7. In the terminal, now run: `npm start`. If everything was setup successfully, you will see following prompt:
```bash
> node index.js

API server ready on http://localhost:3000
```
 - If you visit the above URL in your browser, you should see `Hello world`
 - Tip: APIs are much easier to work with using tools such as [Postman](https://www.postman.com/) or the [Thunder Client](https://www.thunderclient.com/) which is an extension for VS Code. Class examples will use the Thunder Client.
 - There is a great set of [videos](https://www.youtube.com/watch?v=YKalL1rVDOE&list=PLM-7VG-sgbtBsenu0CM-UF3NZj3hQFs7E) by Postman on how to use this tool.
 - If you find the video too fast-paced, please try this [tutorial](https://www.guru99.com/postman-tutorial.html) which covers similar topics but doesn't have as much complexity.

### Completion
Let's commit our changes from the above steps, and push our changes up to gitlab.

 ## Route Setup
 When using express, or other similar frameworks, the concept of a route is to utilize the URI path to action on functionality, e.g. if you request a resource located at `/todo` it will provide you with a reasonable response that is specific for that resource.

 For this lab, we will enhance our setup to leverage the express router (`express.Router`) which is designed specifically for organizing routes across modules in node.js.

 1. Create a new folder called `src`
 2. In the `src` folder, create a file called `items.js`.
 3. `items.js` will be the file where we add all routes in the lab.
 4. In `items.js`, let's set it up with the following code:
 ```javascript
 import express from 'express'
 const router = express.Router()
 const items = [{id: 1, task: "buy groceries"}, {id:2, task: "clean room"}]

 router.get('/', (req, res) => {
     return res.json(items)
 })

 export default router
 ```
 5. Let's make our express app aware of our new route module! In `index.js`, add the following import statement after the other import statements:
 ```javascript
 import itemRoutes from './src/items.js'
 ```
 6. After the `app.get('/'...)`, let's mount our new routes, by adding a new route:
 ```javascript
 app.use('/items', itemRoutes)
 ```

 7. Restart the node app again, by ending the current running one, and running `npm start`
 8. Using either your browser or postman (preferred!), request `GET http://localhost:3000/items` (note the way this is described, it is a common pattern when working with API to list the HTTP method with the URI). You should see a JSON object:
 ```json
 [
    {
        "id": 1,
        "task": "buy groceries"
    },
    {
        "id": 2,
        "task": "clean room"
    }
]
 ```
  **Note** The reason why this URL works even though we don't have a specific `GET /items` function is due to what's referred to as mounting, in which we said a series of URI appended to the base URI, in this case, it was the routes declared in `item.js` but mounted on `/items` in the `index.js` file using an express `middleware` (we'll review more about this in a future class)

9. Let's try a little more complex route. Let's create a `POST` request. In `items.js`, add a new route for a `POST` method, e.g. this defines what we would normally refer to `POST /items` endpoint:
```javascript
router.post('/', (req, res) => {
    items.push(req.body)
    return res.status(201).json(req.body)
})
```
10. To test the above, you will need to use `Postman` or something similar as a browser can't be directly used for such requests. On `Postman`, make a `POST` request for `http://localhost:3000/items` with the following JSON:
```json
{
    "id": 3,
    "task": "take test"
}
```
If successful, you'll see the above JSON object in the response as well.

*Tip*: Make a `GET /items` request as well, you'll notice the above object as part of the array of `items` as well. 

11. Routes can also allow for dynamic paths to be created. This is typically refered to as parameters. Let's create the `GET /items/:id` route. It is a convention that parameters typically have a colon (`:`) in front of them. Let's add the following route to `items.js`:
```javascript
router.get('/:id', (req, res) => {
    return res.send(`You just requested item that should be with id ${req.params.id}`) // we are using the send function here because we are not returning an object but only a string
})
```

- Make a request such as: `GET /items/3` and you should see the above message with 3 in it.

**Tip**: Are you getting tired of stopping the server, and starting again to see your changes? `Nodemon` can help with that! Nodemon is package that checks for changes in your application as you save your files, and automatically restarts the server when a change is made. Let's install it!

Run the following command:
```console
npm install nodemon --save-dev
```
The `--save-dev` flag means that install this dependency as a development dependency, meaning it should not be installed for production use. 

Lastly, let's create a new script in `package.json`. Add: `"dev": "nodemon index.js"`, e.g.:
```json
"scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  ```
  Stop the current server if running, and run `npm run dev`. Now any changes you save, it will restart the node server for you!

12. Let's add some validation to our `POST /items` endpoint by sending back the status code used to refer to a `Bad Request` which is `400`. We will consider a request to be invalid if the object in request does not have any of these properties in its object: `id` or `task`.
```javascript
router.post('/', (req, res) => {
    items.push(req.body)
    return res.status(201).json(req.body)
})
```

a. In the above code, let's first add in the list of required properties, replace above with:
```javascript
router.post('/', (req, res) => {
    const requiredProperties = ['id', 'task']
    items.push(req.body)
    return res.status(201).json(req.body)
})
```
b. Now that we have an array, let's iterate over this array, and check if the property exists, if it does not, we will add it to a new array which holds any of the missing properties. We can check if an object has a given property or not by using the `hasOwnProperty(name of property)` method which returns a true/false, more details available in [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty):
```javascript
router.post('/', (req, res) => {
    const requiredProperties = ['id', 'task']
    let missingProperties = []

    requiredProperties.forEach(prop => {
        if (!req.body.hasOwnProperty(prop)) {
            missingProperties.push(prop)
        }
    })
    items.push(req.body)
    return res.status(201).json(req.body)
})
```
c. Now that we have created a way to check if a property is missing, let's put in a conditional to return back the appropriate response. Interestingly we can take advantage of the fact that we have essentially recorded the numbers of possible errors found in our `missingProperties` array:
```javascript
router.post('/', (req, res) => {
    const requiredProperties = ['id', 'task']
    let missingProperties = []

    requiredProperties.forEach(prop => {
        if (!req.body.hasOwnProperty(prop)) {
            missingProperties.push(prop)
        }
    })

    if (missingProperties.length) { // we do not need a specific comparison here because a 0 is essentially the same as false
        // we have missing properties!
        let errorMessage = []
        missingProperties.forEach(prop => {
            errorMessage.push(`Missing property: ${prop}`)
        })
        return res.status(400).json({ errors: errorMessage })
    }
    items.push(req.body)
    return res.status(201).json(req.body)
})
```

Since we return early in the if condition checking for `missingProperties` length, we actually do not need another if condition as the function will have completed its execution.

Try sending a POST request again, first with no data, and then again with some combination of missing properties.

### Completion
Let's commit our changes from the above steps, and push our changes up to gitlab.

## Individual Practice
Now that you have worked with more examples, let's try few exercises. 

### Overview
For each excercise below, please follow these steps:
- Create a new branch
- Solve the given exercise
- Commit your solution, and push to GitHub
- Create a merge request, and after doing a quick review, merge the request
- After you have merged, you need to update locally before you create a new branch to start on the next exercise. To do that, locally run: 
    - `git checkout master`
    - `git pull origin master`
    - the above commands get you back to your main branch locally, updates it with the changes you have merged in gitlab, and helps you continue making more changes. 
    - There is a [tip sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf) from GitHub that outlines common tasks. 

### Example Status Codes
- `400`: Bad Request
- `200`: Ok (used for any request that does not modify something)
- `204`: No Content (used for `Delete` as the resource requested is no longer available, or when there is no body for the response)
- `201`: Created (when you are creating a new entry in the system/database/etc)

### Exercises
**Note**: Please have the following exercises completed in a separate branch and add instructor (`affafah`) to the PR for weekly exercise 1 grading. These exercises are to be completed by next Saturday following the lesson.

1. Update the `GET /items/:id` endpoint to return the actual item in the `items` array that has the same `id` as the one in the parameter `:id`.

1. Create a new endpoint for `PUT /items/:id`. The object given should have both properties (`id`, `task`) in it. 
This endpoint should find the item in the array, and update the `task` property with what was provided in the request. It should send the appropriate status code if the item was updated, alongside the updated item. If the `id` is not found, it should send back the `not found` status code. If the `id` is not equal to the `id` in the URI, this should be considered a bad request, and send back the appropriate status code. 

1. Create a new endpoint with route `DELETE /items/:id`. This endpoint should remove the item that has the same `id` as the parameter, and send the appropriate status code.

1. Create a new endpoint `PATCH /items/:id`. It should only need to accept a single property `task`, and it can change the value of the given item in the array, and send back with the appropriate status code and the updated item.

