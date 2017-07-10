const AWS = require('aws-sdk');
const uuid = require('node-uuid');
const fs = require('fs');

const s3 = new AWS.S3();
const transcoder = new AWS.ElasticTranscoder({ region: 'us-west-2' });


const audioRawBucket = 'audio-raw';
const filename = '08 - Looping Steps.mp3';

const uploadFile = filename =>
  fs.readFile(`audio/${filename}`, (err, data) => {
    if (err) {
      throw err;
    }

    s3.upload({
      Bucket: audioRawBucket,
      Key: filename,
      Body: new Buffer(data, 'binary'),
      ACL: 'public-read'
    }, (err, data) => {
      console.log('err:', JSON.stringify(err));
      console.log('data:', JSON.stringify(data));
      // console.log(arguments);
      console.log('Successfully uploaded file.');
    });

  });

// uploadFile(filename);

const audioCutPipelineId = '1499704615497-2bsssf'; // audio-cut
const flacPresetId = '1499706146017-1vv8v0'; // flac copy

transcoder.createJob({
  PipelineId: audioCutPipelineId,
  Input: {
    Key: filename,
  },
  Outputs: [
    {
      Key: filename + '-cut1.flac',
      PresetId: flacPresetId,
      Composition: [{
        TimeSpan: {
          StartTime: '00:00:05.000', //HH:mm:ss.SSS or sssss.SSS
          Duration: '00:00:10.000',
        }
      }]
    },
    {
      Key: filename + '-cut2.flac',
      PresetId: flacPresetId,
      Composition: [{
        TimeSpan: {
          StartTime: '00:00:10.000', //HH:mm:ss.SSS or sssss.SSS
          Duration: '00:00:05.000',
        }
      }]
    }
  ]
}, (err, data) => {
  console.log('err:', JSON.stringify(err));
  console.log('data:', JSON.stringify(data));
});
