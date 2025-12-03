<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Author;

class AuthorController extends Controller
{

    public function index(Request $r)
    {
        $q = Author::query();

        if ($r->filled('search')) {
            $search = $r->search;
            $q->whereRaw("concat(first_name, ' ', last_name) ILIKE ?", ["%{$search}%"]);
        }

        $sort = $r->get('sort', 'id_desc');

        $sortMap = [
            'name_asc'  => ['first_name', 'asc'],
            'name_desc' => ['first_name', 'desc'],
            'id_asc'    => ['id', 'asc'],
            'id_desc'   => ['id', 'desc'],
        ];

        [$sortCol, $sortDir] = $sortMap[$sort] ?? ['id', 'desc'];
        $q->orderBy($sortCol, $sortDir);

        $perPage = min(100, intval($r->get('per_page', 15)));

        $authors = $q->paginate($perPage);

        return response()->json([
            "data" => $authors->items(),
            "meta" => [
                "current_page" => $authors->currentPage(),
                "last_page"    => $authors->lastPage(),
                "per_page"     => $authors->perPage(),
                "total"        => $authors->total(),
            ]
        ]);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'bio' => 'nullable|string'
        ]);

        $author = Author::create($data);

        return response()->json($author, 201);
    }

    public function show($id)
    {
        $author = Author::find($id);

        if (!$author) {
            return response()->json(['message' => 'Author tidak ditemukan'], 404);
        }

        return response()->json($author->load('books'));
    }

    public function update(Request $r, $id)
    {
        $author = Author::find($id);

        if (!$author) {
            return response()->json(['message' => 'Author tidak ditemukan'], 404);
        }

        $data = $r->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'bio' => 'nullable|string'
        ]);

        $author->update($data);

        return response()->json($author, 200);
    }

    public function destroy($id)
    {
        $author = Author::find($id);

        if (!$author) {
            return response()->json(['message' => 'Author tidak ditemukan'], 404);
        }

        $author->delete();
        return response()->json(['message' => 'Author berhasil dihapus'], 200);
    }

    public function list()
    {
        $authors = Author::select('id', 'first_name', 'last_name')->get();
        return response()->json($authors);
    }

}
