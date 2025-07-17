# Minimal Reproduction of StepFunction Issue

I've been facing an issue with StepFunctions in sst. I have defined a simple StepFunction
definition in this repository to demonstrate the issue. I would expect to be able to trigger
the StepFunction execution with an `input` object. The data from the `input` object should
be present in the first (`event`) parameter of the Lambda Handler referenced in the
`sst.aws.StepFunctions.lambdaInvoke` call.

However, when I run `npx sst dev` and trigger an execution from the AWS console, I get the
following log from the lambda handler which indicates that the event object is empty and
does not contain the input data.

```
|  Invoke      packages/functions/src/lambda.handler
|  +6ms        Event: {}       <---- The event is empty here.
|  +6ms        Context: {
|  +6ms          "awsRequestId": "***",
|  +6ms          "invokedFunctionArn": "***",
|  +6ms          "functionName": "***",
|  +6ms          "functionVersion": "***",
|  +6ms          "logGroupName": "***",
|  +6ms          "logStreamName": "***",
|  +6ms          "callbackWaitsForEmptyEventLoop": ***
|  +6ms        }
|  Done        took +81ms
```

I've also tried passing each of these `payload` parameters to the
`sst.aws.StepFunctions.lambdaInvoke` call, but they all show up in the `Event` literally
rather than injecting the `input` object.

```
payload: { "$": "$" }
```

```
payload: { "Payload.$": "$" }
```

```
payload: { "Input.$": "$" }
```

```
payload: { "Foo.$": "$.Foo" }
```

Example:

```
|  Invoke      packages/functions/src/lambda.handler
|  +9ms        Event: {
|  +10ms         "$": "$"       <---- The payload gets inserted literally here.
|  +10ms       }
|  +10ms       Context: {
|  +10ms         "awsRequestId": "***",
|  +10ms         "invokedFunctionArn": "***",
|  +10ms         "functionName": "***",
|  +10ms         "functionVersion": "***",
|  +10ms         "logGroupName": "***",
|  +10ms         "logStreamName": "***",
|  +10ms         "callbackWaitsForEmptyEventLoop": ***
|  +10ms       }
|  Done        took +105ms
```