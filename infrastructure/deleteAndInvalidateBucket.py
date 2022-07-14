import time

import boto3


def handler(event, context):
    bucketName = event['BucketName']
    distributionId = event['DistributionId']
    allFiles = ['/*']
    client = boto3.client('cloudfront')
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(f'{bucketName}')
    bucket.objects.all().delete()

    
    client.create_invalidation(
        DistributionId=f'{distributionId}',
        InvalidationBatch={
            'Paths': {
                'Quantity': 1,
                'Items': allFiles
        },
        'CallerReference': str(time.time())
    })
    
    pipeline = boto3.client('codepipeline')
    response = pipeline.put_job_success_result(
        jobId=event['CodePipeline.job']['id']
    )
    return response
