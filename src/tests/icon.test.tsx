import { render, screen } from '@testing-library/react';
import Icon from '../components/icon'; 
import { GrTable } from 'react-icons/gr';
import { BsFillPersonCheckFill } from 'react-icons/bs';
import { FaHandHoldingMedical } from 'react-icons/fa6';
import { MdMoney } from 'react-icons/md';
import { TbReport } from 'react-icons/tb';

describe('Icon Component', () => {
  const testCases = [
    { type: 'addTransaction', heading: 'Add Transaction', IconComponent: GrTable },
    { type: 'create-budget', heading: 'Create Budget', IconComponent: BsFillPersonCheckFill },
    { type: 'create-saving', heading: 'Create Saving Goal', IconComponent: FaHandHoldingMedical },
    { type: 'recent-transactions', heading: 'Recent transactions', IconComponent: MdMoney },
    { type: 'unknown', heading: 'Generate Reports', IconComponent: TbReport }, 
  ];

  testCases.forEach(({ type, heading, IconComponent }) => {
    test(`renders correct icon and heading for type "${type}"`, () => {
      render(<Icon type={type} />);

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(heading);

      const iconElement = screen.getByTestId('icon-container');
      expect(iconElement.querySelector('svg')).toBeInTheDocument();
    });
  });

  test('has the correct container structure and classes', () => {
    const { container } = render(<Icon type="addTransaction" />);
    expect(container.firstChild).toHaveClass('tagIconContainer');
    expect(container.querySelector('.iconContainer')).toBeInTheDocument();
    expect(container.querySelector('.tagContainer')).toBeInTheDocument();
  });
});
