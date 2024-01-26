import classNames from 'classnames';

export function formatLocation(job: any) {
  const { city, state, country } = job;
  let location = '';

  if (city) {
    location += city;
    if (state) location += `, ${state}`;
    if (country) location += `, ${country}`;
  } else if (state) {
    location += state;
    if (country) location += `, ${country}`;
  } else if (country) {
    location += country;
  }

  return location;
}

export function formatLocationWithWorkplace(job: any) {
  const { workplace } = job;

  let location = formatLocation(job);
  if (workplace) {
    if (location) location += ` (${workplace})`;
    else location = workplace;
  }

  return location;
}

interface JobPreviewProps {
  idx: number;
  job: any;
  activeJob: any | undefined;
  setActiveJob: (job: any) => void;
}

const JobPreview = ({ idx, job, activeJob, setActiveJob }: JobPreviewProps) => {
  const location = formatLocationWithWorkplace(job);
  const isActive = activeJob?.id === job.id;
  return (
    <div className='group'>
      <div
        onClick={() => setActiveJob(job)}
        className={classNames(
          'w-full h-full p-4 rounded cursor-pointer border border-slate-300',
          isActive ? 'bg-slate-200' : 'bg-slate-50 group-hover:bg-slate-100'
        )}
      >
        {job.score && (
          <div className='flex items-center justify-between'>
            <p className='font-semibold'>{idx}.</p>
            <p
              className={classNames(
                'bg-white px-2 py-0.5 text-xs text-semibold tracking-wide rounded border-slate-200 border',
                { 'group-hover:bg-slate-50': !isActive }
              )}
            >
              cosine distance: {job.score.toFixed(5)}
            </p>
          </div>
        )}
        <p className='mt-2 font-medium'>{job.title}</p>
        <p className='mt-2 text-sm text-slate-500'>{job.companyName}</p>
        {location && <p className='text-sm text-slate-500 mt-1'>{location}</p>}
      </div>
    </div>
  );
};

export default JobPreview;