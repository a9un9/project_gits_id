<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{

    public function index(Request $r)
    {
        $q = Book::with(['author', 'publisher']);

        if ($r->filled('search')) {
            $search = $r->search;

            $q->where(function ($qq) use ($search) {
                $qq->where('title', 'ILIKE', "%{$search}%")
                ->orWhere('description', 'ILIKE', "%{$search}%")

                ->orWhereHas('author', function ($a) use ($search) {
                    $a->where('first_name', 'ILIKE', "%{$search}%")
                    ->orWhere('last_name', 'ILIKE', "%{$search}%");
                })

                ->orWhereHas('publisher', function ($p) use ($search) {
                    $p->where('name', 'ILIKE', "%{$search}%");
                });
            });
        }

        $sort = $r->get('sort', 'id_desc');

        $sortMap = [
            'name_asc'  => ['title', 'asc'],
            'name_desc' => ['title', 'desc'],
            'id_asc'    => ['id', 'asc'],
            'id_desc'   => ['id', 'desc'],
        ];

        [$sortCol, $sortDir] = $sortMap[$sort] ?? ['id', 'desc'];
        $q->orderBy($sortCol, $sortDir);

        $perPage = min(100, intval($r->get('per_page', 15)));
        $books = $q->paginate($perPage);

        return response()->json([
            "data" => $books->items(),
            "meta" => [
                "current_page" => $books->currentPage(),
                "last_page"    => $books->lastPage(),
                "per_page"     => $books->perPage(),
                "total"        => $books->total(),
            ]
        ]);
    }

    public function store(Request $r)
    {

        $messages = [
            'author_id.exists' => 'Author yang dipilih tidak valid atau tidak ada di database.',
            'publisher_id.exists' => 'Publisher yang dipilih tidak valid atau tidak ada di database.',
        ];

        $data = $r->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author_id' => 'required|exists:authors,id',
            'publisher_id' => 'required|exists:publishers,id',
            'price' => 'required|numeric|min:0',
            'published_year' => 'required|integer|min:1000|max:9999',
        ], $messages);

        $book = Book::create($data);

        return response()->json($book, 201);
    }

    public function show($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['message' => 'Book tidak ditemukan'], 404);
        }

        return response()->json($book->load('books'));
    }

    public function update(Request $r, $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['message' => 'Book tidak ditemukan'], 404);
        }

        $data = $r->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'author_id' => 'sometimes|required|exists:authors,id',
            'publisher_id' => 'sometimes|required|exists:publishers,id',
            'price' => 'sometimes|required|numeric|min:0',
            'published_year' => 'sometimes|required|integer|min:1000|max:9999'
        ]);

        // // debug
        // if (empty($data)) {
        //     return response()->json(['message' => 'Tidak ada data yang dikirim'], 400);
        // }

        $book->update($data);

        return response()->json($book, 200);
    }

    public function destroy($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['message' => 'Book tidak ditemukan'], 404);
        }

        $book->delete();
        return response()->json(['message' => 'Book berhasil dihapus'], 200);
    }
}
