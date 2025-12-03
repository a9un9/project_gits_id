<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Publisher;

class PublisherController extends Controller
{

    public function index(Request $r)
    {
        $q = Publisher::query();

        if ($r->filled('search')) {
            $search = $r->search;
            $q->whereRaw("name ILIKE ?", ["%{$search}%"]);
        }

        $sort = $r->get('sort', 'id_desc');

        $sortMap = [
            'name_asc'  => ['name', 'asc'],
            'name_desc' => ['name', 'desc'],
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
            'name' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        $publisher = Publisher::create($data);

        return response()->json($publisher, 201);
    }

    public function show($id)
    {
        $publisher = Publisher::find($id);

        if (!$publisher) {
            return response()->json(['message' => 'Publisher tidak ditemukan'], 404);
        }

        return response()->json($publisher->load('books'));
    }

    public function update(Request $r, $id)
    {
        $publisher = Publisher::find($id);

        if (!$publisher) {
            return response()->json(['message' => 'Publisher tidak ditemukan'], 404);
        }

        $data = $r->validate([
            'name' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
        ]);

        $publisher->update($data);

        return response()->json($publisher, 200);
    }

    public function destroy($id)
    {
        $publisher = Publisher::find($id);

        if (!$publisher) {
            return response()->json(['message' => 'Publisher tidak ditemukan'], 404);
        }

        $publisher->delete();
        return response()->json(['message' => 'Publisher berhasil dihapus'], 200);
    }
    
    public function list()
    {
        $publishers = Publisher::select('id', 'name')->get();
        return response()->json($publishers);
    }

}
