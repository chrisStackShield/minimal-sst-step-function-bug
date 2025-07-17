/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "minimal-step-function-bug",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const lambdaToInvoke = new sst.aws.Function("LambdaToInvoke", {
      handler: "packages/functions/src/lambda.handler",
    });
    const invokeLambda = sst.aws.StepFunctions.lambdaInvoke({
      name: "InvokeLambda",
      function: lambdaToInvoke,
    })
    const success = sst.aws.StepFunctions.succeed({ name: "Success" })
    const error = sst.aws.StepFunctions.fail({ name: "Error" })
    const definition = invokeLambda
      .catch(error)
      .next(success)

    const stateMachine = new sst.aws.StepFunctions("StateMachine", { definition });

    return {
      "stateMachineArn": stateMachine.arn,
    }
  },
});
