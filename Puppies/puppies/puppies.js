var active = true;

try {
    chrome.storage.sync.get({
        activate: true
    }, function (items) {
        active = items.activate;
        if (active) {
            main();
        }
        track(items.activate ? "true" : "false");
    });
} catch (e) {
    if (active) {
        main();
    }
    track("undefined");
}

function track(active) {
    //Analytics
    var _gaq = window._gaq || [];
    _gaq.push(['_setAccount', 'UA-43973753-3']);
    _gaq.push(['_gat._forceSSL']);
    _gaq.push(["_setCustomVar", 1, "Active", active, 3]);
    _gaq.push(['_trackPageview']);
}

//Content script, image replacer
function main() {
    
    //images 
    (function ($) {

        var self = {
            puppiesImgs: [
                "https://img.buzzfeed.com/buzzfeed-static/static/2015-02/19/10/campaign_images/webdr07/17-puppies-who-are-so-cute-they-will-make-you-mad-2-30501-1424359138-6_dblbig.jpg",
                "https://www.dailydogstuff.com/wp-content/uploads/2016/06/puppy-dozing-off.jpg",
                "https://www.pets4homes.co.uk/images/articles/3825/large/how-much-sleep-do-puppies-actually-need-585a6d2b3e251.jpg",
                "https://fthmb.tqn.com/5N3liyIqU_jAQh1zzy7YSqBwkMM=/1024x683/filters:no_upscale():fill(transparent,1)/puppy-toy-581107c75f9b58564c6b6438.jpg",
                "http://cdn-img.health.com/sites/default/files/styles/large_16_9/public/styles/main/public/gettyimages-522881398.jpg?itok=0g33xDwx",
                "http://www.drpaws.com.au/delahey//images/uploads/services/PuppyPreSchool_Banner_650x300.jpg",
                "https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/All-about-puppies--Cesar%E2%80%99s-tips%2C-tricks-and-advice.jpg?itok=bi9xUvwe",
                "https://timedotcom.files.wordpress.com/2017/11/puppies-puerto-rico.jpeg?quality=85",
                "https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/The-stages-of-puppy-growth.jpg?itok=9ptPJwY8",
                "https://cdn.shopify.com/s/files/1/1368/5523/products/Caramel_Poodle_RTP3_1024x1024.jpg?v=1470626742",
                "https://vignette.wikia.nocookie.net/clashofclans/images/d/dd/Aaaaaawwwwwwwwww-Sweet-puppies-9415255-1600-1200.jpg/revision/latest?cb=20140627154809",
                "https://i.ytimg.com/vi/2Y1ZyjGdPeE/maxresdefault.jpg",
                "https://media.timeout.com/images/103853123/630/472/image.jpg",
                "https://gfp-2a3tnpzj.stackpathdns.com/wp-content/uploads/2016/07/Cockalier-Puppies-For-Sale-600x600.jpg",
                "https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/Cesars-Today-Top-Ten-Puppy-Tips.jpg?itok=T2AuVJHq",
                "https://cdn.shopify.com/s/files/1/1267/6891/collections/IMG_7455_large.jpg?v=1488765853",
                "http://cdn1-www.dogtime.com/assets/uploads/2016/03/adorable-puppies-playing-5-300x199.jpg",
                "https://list25.com/wp-content/uploads/2013/08/pugpuppies2-610x412.jpg",
                "https://az616578.vo.msecnd.net/files/2016/03/11/635933179071320928-578241977_eedce5725abdb89fb7c8ef844f8b0257.jpg",
            ],

            //Handles all images on page with an interval of time
            handleImages: function (lstImgs, time) {
                $.each($('img'), function (i, item) {
                    //Skip if image is already replaced
                    if ($.inArray($(item).attr('src'), lstImgs) == -1) {
                        var h = $(item).height();
                        var w = $(item).width();

                        //If image loaded
                        if (h > 0 && w > 0) {

                            self.handleImg(item, lstImgs);
                        }
                        else {
                            //Replace when loaded
                            $(item).load(function () {
                                //Prevent 'infinite' loop
                                if ($.inArray($(item).attr('src'), lstImgs) == -1) {
                                    self.handleImg(item, lstImgs);
                                }
                            });
                        }
                    }
                });

                //Keep replacing
                if (time > 0) {
                    setTimeout(function () { self.handleImages(lstImgs, time); }, time);
                }
            },
            //Replace one image
            handleImg: function (item, lstImgs) {
                $(item).error(function () {
                    //Handle broken imgs
                    self.handleBrokenImg(item, lstImgs);
                });

                self.setRandomImg(item, lstImgs);
            },
            //Set a random image from lstImgs to item 
            setRandomImg: function (item, lstImgs) {
                var h = $(item).height();
                var w = $(item).width();
                $(item).css('width', w + 'px').css('height', h + 'px');
                $(item).attr('src', lstImgs[Math.floor(Math.random() * lstImgs.length)]);
            },
            //Removed broken image from lstImgs, run handleImg on item
            handleBrokenImg: function (item, lstImgs) {

                var brokenImg = $(item).attr('src');
                var index = lstImgs.indexOf(brokenImg);
                if (index > -1) {
                    lstImgs.splice(index, 1);
                }
                self.setRandomImg(item, lstImgs);
            },
        };

        //Run on jQuery ready
        $(function () {

            self.handleImages(self.puppiesImgs, 3000);

        });

        //Set global variable
        $.puppies = self;


    })(jQuery);
    //end puppies
}
