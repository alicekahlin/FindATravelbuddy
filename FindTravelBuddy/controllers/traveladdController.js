const Traveladd = require('../models/traveladd');

const traveladd_index = async (req,res)=>{
    const page = parseInt(req.query.page); //page from url
    const limit = 4; //limit of adds on one page

    var totalPage = await Traveladd.countDocuments()/limit; 
    
    totalPage = Math.ceil(totalPage);

    const startIndex = (page - 1) * limit; 
    const endIndex = page * limit; 

    const traveladds = {}; 

    if(endIndex < await Traveladd.countDocuments().exec()){
        traveladds.next = {
            page: page + 1,
            limit: limit
        }
    }
    
    if(startIndex > 0){
        traveladds.previous = {
            page: page - 1,
            limit: limit
        }
    }
    
   try{
        traveladds.results = await Traveladd.find().sort({createdAt: -1}).limit(limit).skip(startIndex).exec();
        res.render('traveladds/index', {title: "All Traveladds", traveladds: traveladds.results, pages: totalPage});
   }catch (e) {
        res.status(400).json({message: e.message})
   }
    
}

const traveladd_details = (req,res) =>{
    const id = req.params.id;
    Traveladd.findById(id)
    .then(result =>{
        res.render('traveladds/details', {traveladd: result, title:'Traveladds details'});
    })
    .catch(err=>{
        res.status(404).render('404', {title: "Page not found"});
    });
}

const traveladd_create_get = (req,res) =>{
    res.render('traveladds/create', {title: 'Create'});
}


function dateToInt(date) {

    var values = date.split("-"); 
    var year = parseInt(values[0]);
    var month = parseInt(values[1]);
    var totalStartdate = year*100 + month;
    return totalStartdate;

}

const traveladd_create_post = (req,res) =>{

    const traveladd = new Traveladd({
        title:          req.body.title, 
        destination:    req.body.destination, 
        startdate:      dateToInt(req.body.startdate), 
        enddate:        dateToInt(req.body.enddate), 
        minbudget:      req.body.minbudget, 
        maxbudget:      req.body.maxbudget, 
        description:    req.body.description , 
        creatorId:      req.body.creatorId , 
        creatorName:    req.body.creatorName , 
        creatorGender:  req.body.creatorGender, 
        creatorAge:     req.body.creatorAge, 
    }); 

    traveladd.save()
    .then((result)=>{
        res.redirect('/traveladds');
    })
    .catch((err)=>{
        console.log(err);
    });
}

const traveladd_delete = (req,res) =>{

    const id= req.params.id;
    Traveladd.findByIdAndDelete(id)
    .then(result =>{
        res.json({redirect: '/traveladds'});
    })
    .catch(err=>{ 
        console.log(err);
    });
}

module.exports= {
    traveladd_index, 
    traveladd_details,
    traveladd_create_get,
    traveladd_create_post,
    traveladd_delete
}