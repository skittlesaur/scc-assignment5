import Content from '../components/content'
import Header from '../components/header'

const HomePage = () => {
  return (
    <div className="bg-neutral-900 text-neutral-100 min-h-screen px-8 py-4 flex flex-col gap-10">
      <Header />
      <Content />
    </div>
  )
}

export default HomePage