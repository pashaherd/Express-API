const express = require('express')
const router = express.Router(); 
const items =  new Map([[1 ,{id:1, item:'item1'}], [2, {id:2, item:'item2'}],[3,{id:3, item:'item3'}]]); 


router.get('/items/:id', (req,res) =>{
    const id = items.get(req.params.id); 

    res.status(200).json(id); 
})

router.put('/items/:id', (req,res) =>{
    const itemsId = parseInt(req.params.id); 
   
    if(!items.has(itemsId)){
        res.status(204).json({msg:'Item Not Found'})
    }
    
    const updatedItem = [itemsId, {id:itemsId, item:`item${itemsId}.5`}]; 
    items.set(itemsId, updatedItem); 

    res.status(200).json({message:'Items Updated', updatedItem})
})

router.delete('/items/:id', (req,res) =>{
    const itemId = parseInt(req.params.id); 

    if(!items.has(itemId)){
        return res.status(404).json({error:'Item Not Found'})
    }

    items.delete(itemId); 
    res.json({message:'Item deleted'})

})



router.patch("/items/:id", (req,res) =>{
    const itemId = parseInt(req.params.id); 

    if(!items.has(itemId)){
        res.status(404).json({error:'Not Found'})
    }

    items.set(itemId,{id:itemId, items:`item${itemId} Updated`})
})


export default router