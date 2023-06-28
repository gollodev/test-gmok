import { useEffect, useState } from 'react'
import Button from './components/Button'

const BASE_API_URL = 'https://randomuser.me/api/?page=1&results=100'

const fetchUsers = async () => await (await fetch(BASE_API_URL)).json()

function App() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [backupUsers, setBackupUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    (async () => {
      const response = await fetchUsers()
      setUsers(response.results)
    })()
  }, [])

  const restoreState = async () => {
    if (backupUsers.length > 0) {
      const previousStates = backupUsers.map(backup => backup);
      setUsers(previousStates[0]);
      setBackupUsers([]);
    }
  }

  const deleteUser = (userId) => {
    setBackupUsers(prevBackups => [...prevBackups, users])
    const updateUserState = users.filter(user => user.login.uuid !== userId)
    setUsers(updateUserState)
  }

  const sortUsers = (sortedType) => {
    let sortedUsers
    if (sortedType === 'country') {
      sortedUsers = [...users].sort((a, b) => a.location.country.localeCompare(b.location.country));
      setUsers(sortedUsers);
    }

    if (sortedType === 'name') {
      sortedUsers = [...users].sort((a, b) => a.name.first.localeCompare(b.name.first));
      setUsers(sortedUsers);
    }

    if (sortedType === 'last') {
      sortedUsers = [...users].sort((a, b) => a.name.last.localeCompare(b.name.last));
      setUsers(sortedUsers);
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    const filteredUsers = users.filter(user =>
      user.location.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredUsers)
  }

  return (
    <div className="container mx-auto py-6 grid grid-cols-1 gap-6">
      <h1 className="text-6xl font-bold leading-6 text-center my-6">
        Lista de usuarios
      </h1>
      <header className="flex gap-2 justify-center mb-6">
        <Button>Colorea filas</Button>
        <Button onClick={() => sortUsers('country')}>Ordena por país</Button>
        <Button onClick={restoreState}>Restaurar estado inicial</Button>
        <input className="bg-neutral-500 rounded-lg px-4 py-2" type="text" placeholder="Filtrar por país" value={searchTerm} onChange={handleSearch} />
      </header>
      <main>
        <table className="table-auto mx-auto w-full border-separate border-spacing-2 justify-center text-center">
          <thead>
            <tr>
              <th>Foto</th>
              <th onClick={() => sortUsers('name')}>Nombre</th>
              <th onClick={() => sortUsers('last')}>Apellido</th>
              <th onClick={() => sortUsers('country')}>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!users && (<span>users not found...</span>)}
            {users.length && searchTerm.trim() === '' ? (
              users.map(user => (
                <tr key={user.login.uuid} className="hover:bg-blue-500 py-6 px-6">
                  <td>
                    <img className="rounded-full mx-auto" src={user.picture.thumbnail} alt="avatar" />
                  </td>
                  <td>{user.name.first}</td>
                  <td>{user.name.last}</td>
                  <td>{user.location.country}</td>
                  <td>
                    <Button onClick={() => deleteUser(user.login.uuid)}>Delete</Button>
                  </td>
                </tr>
              ))
            ): (
              filteredUsers.map(user => (
                <tr key={user.login.uuid}>
                  <td>
                    <img className="rounded-full" src={user.picture.thumbnail} alt="avatar" />
                  </td>
                  <td>{user.name.first}</td>
                  <td>{user.name.last}</td>
                  <td>{user.location.country}</td>
                  <td>
                    <Button onClick={() => deleteUser(user.login.uuid)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default App
