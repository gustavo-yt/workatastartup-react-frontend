import DOMPurify from 'isomorphic-dompurify';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';
import _ from 'lodash';
import { formatLocationWithWorkplace } from './JobPreview';
import getSymbolFromCurrency from 'currency-symbol-map';

function formatDate(job: any) {
  const { date } = job;
  if (!date) return;
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatSalaryRange(job: any) {
  const { salaryLow, salaryHigh, salaryLowCurrency, salaryHighCurrency } = job;
  let formattedSalary = '';

  if (salaryLow && salaryHigh) {
    const salaryLowStr = formatSalary(salaryLow, salaryLowCurrency);
    const salaryHighStr = formatSalary(salaryHigh, salaryHighCurrency);
    formattedSalary = `${salaryLowStr} - ${salaryHighStr}`;
  } else if (salaryLow) {
    const salaryLowStr = formatSalary(salaryLow, salaryLowCurrency);
    formattedSalary = `${salaryLowStr} and above`;
  } else if (salaryHigh) {
    const salaryHighStr = formatSalary(salaryHigh, salaryHighCurrency);
    formattedSalary = `${salaryHighStr} and below`;
  }

  return formattedSalary;
}

function formatSalary(amount: number, currency: string | null) {
  const currencySymbol = getSymbolFromCurrency(currency || 'USD');
  return `${currencySymbol}${amount.toLocaleString()}`;
}

interface JobViewProps {
  job: any;
}

const JobView = ({ job }: JobViewProps) => {
  const location = formatLocationWithWorkplace(job);
  const dateString = formatDate(job);
  const salaryRange = formatSalaryRange(job);
  const information: string[] = [];
  if (job.companyName) {
    information.push(job.companyName);
  }
  if (location) {
    information.push(location);
  }
  if (job.type) {
    information.push(_.capitalize(job.type.replace('_', ' ')));
  }
  return (
    <div>
      <div className='flex justify-between mb-8'>
        <div>
          <h2 className='text-2xl mb-2'>{job.title}</h2>
          <p>{information.join(' · ')}</p>
          {salaryRange && <p className='mt-1'>Compensation: {salaryRange}</p>}
        </div>
        {job.url && (
          <Link href={job.url} target='_blank'>
            <button className='bg-slate-700 rounded-full px-4 py-2 tracking-wide text-sm text-white hover:bg-slate-800 flex'>
              Apply on Y Combinator
              <HiArrowRight className='ml-2 mt-0.5' />
            </button>
          </Link>
        )}
      </div>

      {job.description && <p className='text-lg mb-5'>About the job</p>}
      {job.description && (
        <div
          className='text-sm'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(job.description),
          }}
        />
      )}

      {dateString && (
        <p className='mt-8 text-slate-400'>Posted on {dateString}.</p>
      )}
    </div>
  );
};

export default JobView;