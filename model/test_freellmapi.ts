import { generateModel }
  from "../model/model_router.js"

async function main() {

  const result =
    await generateModel(
      "Say hello"
    )

  console.log(
    "MODEL RESULT:"
  )

  console.log(result)
}

main().catch(err => {

  console.error(err)

  process.exit(1)
})
