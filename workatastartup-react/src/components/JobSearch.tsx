'use client';

import {
  DEFAULT_EMBEDDING_MODEL,
  DEFAULT_LONG_INPUT,
  DEFAULT_SHORT_INPUT,
  EMBEDDING_MODEL_TO_COLUMN,
} from '@/utils/constants';
import { HiSearch, HiX } from 'react-icons/hi';
import { useEffect, useState } from 'react';

import CodeBlock from './CodeBlock';
import JobPreview from './JobPreview';
import JobView from './JobView';
import Link from 'next/link';
import classNames from 'classnames';
import { useDebounce } from '@uidotdev/usehooks';

interface ButtonProps {
  children: string;
}

interface JobSearchProps {
  getHtml: (code: string) => Promise<string>;
  searchJobs: (
    embeddingModel: string,
    longInput: string,
    shortInput: string,
    country: string
  ) => Promise<any[]>;
  getQuery: (
    embeddingModel: string,
    longInput: string,
    shortInput: string,
    country: string
  ) => Promise<string>;
  defaultJobs: any[];
  defaultQuery: string;
  defaultHtml: string;
}

const JobSearch = ({
  defaultJobs,
  defaultQuery,
  defaultHtml,
  getHtml,
  searchJobs,
  getQuery,
}: JobSearchProps) => {
  const [shortInput, setShortInput] = useState(DEFAULT_SHORT_INPUT);
  const [longInput, setLongInput] = useState(DEFAULT_LONG_INPUT);
  const [country, setCountry] = useState('');
  const [embeddingModel, setEmbeddingModel] = useState(DEFAULT_EMBEDDING_MODEL);

  const [job, setJob] = useState<any | undefined>(defaultJobs[0]);
  const [jobs, setJobs] = useState<any[]>(defaultJobs);

  const [query, setQuery] = useState(defaultQuery);

  const debouncedLongInput = useDebounce(longInput, 1000);
  const debouncedShortInput = useDebounce(shortInput, 1000);
  useEffect(() => {
    searchJobs(
      embeddingModel,
      debouncedLongInput,
      debouncedShortInput,
      country
    ).then((jobs) => {
      getQuery(
        embeddingModel,
        debouncedLongInput,
        debouncedShortInput,
        country
      ).then(setQuery);
      setJobs(jobs);
      setJob(jobs[0]);
    });
  }, [debouncedLongInput, debouncedShortInput, country, embeddingModel]);

  const CountryButton = ({ children }: ButtonProps) => (
    <button
      className={classNames(
        'py-1 px-4 rounded-full text-sm',
        country === children
          ? 'bg-slate-400 text-white'
          : 'border border-slate-200 bg-white hover:bg-slate-100'
      )}
      onClick={() => setCountry(country === children ? '' : children)}
    >
      {children}
    </button>
  );

  const EmbeddingModelButton = ({ children }: ButtonProps) => (
    <button
      className={classNames(
        'py-1 px-4 rounded-full text-sm',
        embeddingModel === children
          ? 'bg-slate-400 text-white'
          : 'border border-slate-200 bg-white hover:bg-slate-100'
      )}
      onClick={() => setEmbeddingModel(children)}
    >
      {children}
    </button>
  );

  return (
    <div className='flex'>
      <div className='flex-none w-[650px] px-5 flex flex-col gap-y-8 bg-slate-50 border-r-4 border-slate-100 min-h-screen'>
        <div>
          <div className='h-24 pt-8'>
            <h1 className='text-3xl font-bold'>Find a Startup Job</h1>
          </div>

          <p className='mb-3 text-lg'>Search with keywords</p>
          <div className='border border-slate-200 rounded bg-white flex items-center p-2'>
            <input
              value={shortInput}
              onChange={(e) => setShortInput(e.target.value)}
              placeholder='Job title, keywords, or company'
              className='w-full text-sm focus:outline-none'
            />
            {shortInput ? (
              <HiX
                onClick={() => setShortInput('')}
                className='text-slate-500'
              />
            ) : (
              <HiSearch className='text-slate-500' />
            )}
          </div>
        </div>

        <div>
          <p className='mb-3 text-lg'>Tell us about you</p>
          <textarea
            value={longInput}
            onChange={(e) => setLongInput(e.target.value)}
            className='border border-slate-200 rounded text-slate-700 w-full h-28 p-2 text-sm'
          />
        </div>

        <div>
          <p className='mb-3 text-lg'>Country Filter</p>
          <div className='flex gap-x-2'>
            <CountryButton>US</CountryButton>
            <CountryButton>IN</CountryButton>
            <CountryButton>GB</CountryButton>
            <CountryButton>CA</CountryButton>
          </div>
        </div>

        <div>
          <p className='mb-3 text-lg'>Embedding model</p>
          <div className='flex gap-x-2'>
            {Object.keys(EMBEDDING_MODEL_TO_COLUMN).map((model) => (
              <EmbeddingModelButton key={model}>{model}</EmbeddingModelButton>
            ))}
          </div>
        </div>

        <div>
          <p className='mb-3 text-lg'>Generated SQL Query</p>
          <CodeBlock defaultHtml={defaultHtml} code={query} getHtml={getHtml} />
          <p className='mt-4 text-sm'>
            Note: <i>{EMBEDDING_MODEL_TO_COLUMN[embeddingModel]}</i> was
            generated with Lantern.dev's{' '}
            <Link
              href='https://lantern.dev/docs/develop/columns'
              className='font-medium'
            >
              embedding generation feature
            </Link>
          </p>
          <p className='mt-2 text-sm'>
            Note: <i>description_tsvector</i> was generated with to_tsvector
          </p>
        </div>
      </div>

      <div className='w-full px-12'>
        <div>
          <div className='h-24 pt-8'>
            <h1 className='text-3xl'>
              💥 Vector generation and search powered by{' '}
              <Link href='https://lantern.dev' className='text-slate-400'>
                Lantern.dev
              </Link>
            </h1>
          </div>

          <p className='mb-3 text-lg'>Results</p>
          <div className='grid grid-cols-3 gap-x-8'>
            {jobs.map((job_, idx) => (
              <JobPreview
                key={job_.id}
                idx={idx + 1}
                job={job_}
                activeJob={job}
                setActiveJob={setJob}
              />
            ))}
          </div>
        </div>
        <div className='mt-10 border-t-2 border-slate-100 pt-10 pb-10'>
          {job && <JobView job={job} />}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;