export default function Button({ children, onClick }) {
  return (
    <button className="bg-[#1a1a1a] py-2 px-6 rounded-lg border border-transparent border-solid hover:border-blue-500 transition duration-300 ease-in-out" onClick={onClick}>{children}</button>
  )
}
