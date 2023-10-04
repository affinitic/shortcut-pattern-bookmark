export const DisplaySchemaError = ({errors}) => {
  return (
    <>
      Error while importing settings : 
      <ul>
      {errors.map((error, index)=>(
        <li key={index}>{error.message}</li>
      ))}
      </ul>
    </>
  )
}
