
//1
print('');
print('1: How many unique user are there?');
var total_user = db.userdata.distinct("id_member").length;
print(total_user);


2
print('');
print('2: How many tweets(%) did the top 10 users measured by the number of messages) publish?');
var tl=0;
var total_tweets = db.userdata.find().count();
var top10 = db.userdata.aggregate([{$group:{_id:"$id_member",numsum:{$sum:1}}},{$sort:{numsum:-1}},{$limit:10}])

db.userdata.aggregate([{$group:{_id:"$id_member",numsum:{$sum:1}}},{$sort:{numsum:-1}},{$limit:10}],{cursor:{}}).forEach(function(textlength){
   tl+=textlength['numsum'];
})

print('Details of top 10 users '+JSON.stringify(top10));
print('The number of messages sent by top 10 users is '+tl);
print('The percentage of them is '+ tl/total_tweets*100 +'%')



var d1=0;
var d2=0;




//3
print('');
print('3:What was the earliest and lastet data (YYYY-MM-DD HH:MM:SS) that a message was published?');
var earliest = db.userdata.find({},{"timestamp":1,"_id":0}).sort({timestamp: 1}).limit(1);

if (earliest.length()) {
	e = earliest[0];
	print( 'Earliest time: '+ e['timestamp']);
	d1=e['timestamp'];
}

var latest = db.userdata.find({},{"timestamp":1,"_id":0}).sort({timestamp: -1}).limit(1);
if (latest.length()){
   l = latest[0];
   print('Latest time: '+ l['timestamp']);
   d2=l['timestamp'];
}







//4
print('');
print('4: What is the mean time delta between all message?');

function getTime(day){
	re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
	return new Date(re[1],(re[2]||1)-1,re[3]||1,re[4]||0,re[5]||0,re[6]||0).getTime()/1000;
}

var date1 = getTime(d1);
var date2 = getTime(d2);
var meantime=(date2-date1)/total_tweets;
print('The average mean time between each message is '+meantime+' second');




//5
print('');
print('5: What is the mean length of a message');
var s = 0;
var a = 0;
var total_tweets = db.userdata.find().count();
db.userdata.find({},{"text":1 , "_id":0 , "id":1}).forEach(function(meslen){
s += meslen.text.toString().length/total_tweets;
 })

print('The mean length of a message is '+s);





//6
print('');
print('6: What are the 10 most common unigram and bigram strings within the  message?');



//7
print('');
print('7: What is the average number of hashtags(#)used within a message?');
var re = new RegExp("#");
var c = 0 ,csharp=0;
var j=0;
var sumsharp = db.userdata.find({}, {_id: 1, text: 1}).forEach(function(doc){
var len = doc.text.toString().length;
if(doc.text.toString().match(re)){
   c=c+1;
  //  j=0;
  // while (j<len){
  //  if (doc.text.toString().match(re)[j]=='#'){
  //     csharp = csharp+1;
  //     } 
  //     j++;
  //  }
  }

})
print('# totally occur '+c+' times' );
// print(csharp);
// 
print('The average number within a message is '+ c/total_tweets);


//8
print('');
print('8: Which are within the UK contains the largest number of published  message?');
var nst=0, sst=0, est=0, wst=0;
var northest = db.userdata.find({},{"geo_lat":1,"_id":0}).sort({geo_lat: -1}).limit(1);
  nst = northest[0];
  print( 'Northest latittude is: '+ nst['geo_lat']);

var southest = db.userdata.find({},{"geo_lat":1,"_id":0}).sort({geo_lat: 1}).limit(1);
  sst = southest[0];
  print( 'Southest latittude is: '+ sst['geo_lat']);

var eastest = db.userdata.find({},{"geo_lng":1,"_id":0}).sort({geo_lng: -1}).limit(1);
  est = eastest[0];
  print( 'eastest longtittude is: '+ est['geo_lng']);

  var westest = db.userdata.find({},{"geo_lng":1,"_id":0}).sort({geo_lng: 1}).limit(1);
  wst = westest[0];
  print( 'westest longtittude is: '+ wst['geo_lng']);

  var interlat= (nst['geo_lat'] - sst['geo_lat'])/10;
  var interlng= (est['geo_lng']- wst['geo_lng'])/10;

var loop1=0 , loop2=0 , answer=0, area=0, tt=0 , largest=0, largestarea=0;
 do{
  while(loop2<10){
    var last = db.userdata.aggregate([{$match: {geo_lat:{$lt:(nst['geo_lat']-loop1*interlat)}}},
                                      {$match: {geo_lat:{$gt:(nst['geo_lat']-(loop1+1)*interlat)}}},
                                      {$match: {geo_lng:{$gt:(est['geo_lng']-(loop2+1)*interlng)}}},
                                      {$match: {geo_lng:{$lt:(est['geo_lng']-loop2*interlng)}}}
                                                                             ],{cursor:{}}).forEach(function(tol){
                                                                              answer=answer+1;
                                                                             })
      area=area+1;
    if(answer>largest){
      largest=answer;
      largestarea=area;

    }
  
    print('');
    print(area);
    print(answer+' messages came from the area whose Latittude From '+(nst['geo_lat']-loop1*interlat)+' to '+(nst['geo_lat']-(loop1+1)*interlat)+'and longtitude from '+(est['geo_lng']-loop2*interlng)+' to '+(est['geo_lng']-(loop2+1)*interlng));
    loop2=loop2+1;
    tt=tt+answer;
    answer=0;
}
loop1=loop1+1;
loop2=0;
}while(loop1<10);
tt=tt-total_tweets;
print('');
print(tt);
print(largestarea+'area in UK contains the largest number of published messages, the number is: '+largest);





// var loop=0;
//  while(loop<7){
//     var last = db.userdata.aggregate([{$match: {geo_lat:{$lt:(nst['geo_lat']-loop*interlat)}}},
//                                       {$match: {geo_lat:{$gt:(nst['geo_lat']-(loop+1)*interlat)}}},
//                                       {$group: {_id:'$geo_lng', total:{$sum:1}}},
//                                       {$sort:{total:1}},
//                                       {$limit:10} ])
//     print('');
//     print(loop);
//     print(JSON.stringify(last));
//     loop=loop+1;
// }

  // db.userdata.aggregate([{$group:{_id:"$id_member",numsum:{$sum:1}}},{$sort:{numsum:-1}},{$limit:10}])
  // $lt:(nst['geo_lat']-loop*interlat),