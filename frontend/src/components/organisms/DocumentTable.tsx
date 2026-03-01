import  Button  from '../atoms/Button';
import type { DocumentResponse } from "../../types/api";
import { FileText, Trash2, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface DocumentTableProps {
    documents: DocumentResponse[];
    onDelete:(id:number) => void;
    loading: boolean;
    error: string| null;   
}

const DocumentTable = ({documents, onDelete, loading, error}:DocumentTableProps) =>{
    if(loading && documents.length === 0 ){

        return (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500"></Loader2>
                <p className="animate-pulse">Accessing your vault...</p>
            </div>
        );

    }


    if (error){
        return (
            <div className="flex items-center justify-center py-20 text-red-400 gap-2">
                <AlertCircle className="w-5 h-5"></AlertCircle>
                <p>{error}</p>
            </div>
        );
    }

    if(documents.length === 0) {
        return (
            <div className="py-20 text-center text-neutral-500 border-2 border-dashed border-neutral-800 rounded-xl m-4">
                <p>Your vault is empty. Upload a PDF to start reading.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className='w-full text-left border-collapse'>
                <thead>
                    <tr className='border-b border-neutral-800 bg-neutral-900/50'>
                        <th className='px-6 py-4 text-sm font-semibold text-neutral-400 uppercase tracking-wider'>Document</th>
                        <th className='px-6 py-4 text-sm font-semibold text-neutral-400 uppercase tracking-wider'>Status</th>
                        <th className='px-6 py-4 text-sm font-semibold text-neutral-400 uppercase tracking-wider text-right'>Actions</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-neutral-800'>
                    {documents.map((doc) => (
                        <tr key={doc.id} className='hover:bg-neutral-800/40 transition-colors group'>
                            <td className='px-6 py-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='p-2 bg-blue-500/10 rounded-lg'>
                                        <FileText className='w-5 h-5 text-blue-400'></FileText>
                                    </div>
                                    <span className='text-neutral-200 font-medium'>{doc.title}</span>
                                </div>
                            </td>
                            <td className='px-6 py-4'>
                                {doc.is_processed ? (
                                    <div className='flex items-center gap-2 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full w-fit border-emerald-400/20'>
                                        <div className='w-3 h-1.5 rounded-full bg-emerald-400'></div>
                                        Ready
                                    </div>
                                ):(
                                    <div className='flex items-center gap-2 text-amber-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full w-fit border-amber-400/20 animate-pulse'>
                                        <Loader2 className='w-3 h-3 animate-spin'></Loader2>
                                        Proccessing
                                    </div>
                                )}
                            </td>
                            <td className='px-6 py-4 text-right'>
                                <div className='flex justify-end gap-2'>
                                    <Button variant='ghost' className='h-9 px-3' title='Open Reader'>
                                        <ExternalLink className="w-4 h-4"></ExternalLink>
                                    </Button>
                                    <Button
                                        variant='danger'
                                        className='h-9 px-3'
                                        onClick={()=>onDelete(doc.id)}
                                    >
                                        <Trash2 className="w-4 h-4"></Trash2>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentTable