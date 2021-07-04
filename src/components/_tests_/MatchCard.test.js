import * as React from 'react'
import MatchCard from '../MatchCard'
import renderer from 'react-test-renderer'

jest.useFakeTimers()

jest.mock('firebase', () => {
  return {
    auth: jest.fn().mockReturnValue({ currentUser: { uid: 22222 } })
  }
})

const mockedNavigate = jest.fn()

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockedNavigate
    })
  }
})

class CustomDate {
  constructor (date) {
    this.date = date
  }

  toDate () {
    return this.date
  }
}

const setDate = new Date(2021, 5, 15, 12, 0, 0)
const timestamp = new CustomDate(setDate)

const mockItem = {
  success: true,
  timeMatched: timestamp
}

it('renders correctly', () => {
  const tree = renderer.create(<MatchCard item={mockItem} />)
  expect(tree).toMatchSnapshot()
})
