const express = require('express'),
    axios = require('axios'),
    router = express.Router(),
    apod_db = require('../model/apod'),
    path = require('path'),
    fs = require('fs'),
    moment = require('moment'),
    request = require('request');


// https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2021-11-26

router.get('/', (req, res) => {
    res.redirect('apod');
});


const download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
        request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', callback)
    })
}


router.get('/apod', async (req, res) => {
    try {
        let date = req.query.date || moment(new Date()).format('YYYY-MM-DD');
        
        apod_db.findOne({ date: date }).exec(async (err, data) => {
            if (data) {
                
                res.render('astropix', {
                    info: data
                });
            }
            else if (err) {
                res.send(err)
            } else {
                await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=' + date).then(resp => {

                    let newapod = new apod_db({
                        date: resp.data.date,
                        explanation: resp.data.explanation,
                        hdurl: resp.data.hdurl,
                        media_type: resp.data.media_type,
                        service_version: resp.data.service_version,
                        title: resp.data.title,
                        url: resp.data.url.substring(resp.data.url.lastIndexOf("/") + 1, resp.data.url.length)
                    })
                    newapod.save().then((docs) => {
                        if (docs) {
                            const path = path.join('./assets/images/', docs.url)
                            download('https://apod.nasa.gov/apod/' + resp.data.url, path, () => {
                                res.render('astropix', {
                                    info: docs
                                });

                            });
                        } else {
                            res.sendStatus(500);
                        }
                    });
                }).catch(err => {
                    console.error(err);
                    res.send(err);
                });
            }
        })
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;