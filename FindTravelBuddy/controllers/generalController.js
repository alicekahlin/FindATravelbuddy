
const empty_get = (req,res) =>{
    res.redirect('/home');
}

const home_get = (req,res) =>{
  res.render('home', {title: 'Home'});
}

const about_get = (req,res) =>{
    res.render('about', {title: 'About'});
}

module.exports= {
    empty_get,
    home_get,
    about_get,
}

