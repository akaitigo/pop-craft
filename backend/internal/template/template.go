package template

type Category string

const (
	Supermarket Category = "supermarket"
	Drugstore   Category = "drugstore"
	Bookstore   Category = "bookstore"
)

type Pattern string

const (
	Recommendation Pattern = "recommendation"
	Limited        Pattern = "limited"
	StaffPick      Pattern = "staff_pick"
	NewArrival     Pattern = "new_arrival"
	Sale           Pattern = "sale"
)

type Template struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Category    Category `json:"category"`
	Pattern     Pattern  `json:"pattern"`
	Description string   `json:"description"`
	PrimaryColor string  `json:"primary_color"`
	AccentColor  string  `json:"accent_color"`
}

var templates = []Template{
	// Supermarket
	{ID: "super-recommend", Name: "本日のおすすめ", Category: Supermarket, Pattern: Recommendation, Description: "スーパーの日替わりおすすめ商品", PrimaryColor: "#E53935", AccentColor: "#FDD835"},
	{ID: "super-limited", Name: "期間限定", Category: Supermarket, Pattern: Limited, Description: "期間限定セール品", PrimaryColor: "#FB8C00", AccentColor: "#FFFFFF"},
	{ID: "super-staff", Name: "店長イチオシ", Category: Supermarket, Pattern: StaffPick, Description: "店長おすすめ商品", PrimaryColor: "#43A047", AccentColor: "#FDD835"},
	{ID: "super-new", Name: "新商品", Category: Supermarket, Pattern: NewArrival, Description: "新入荷商品のお知らせ", PrimaryColor: "#1E88E5", AccentColor: "#FFFFFF"},
	{ID: "super-sale", Name: "特売", Category: Supermarket, Pattern: Sale, Description: "特売・タイムセール", PrimaryColor: "#E53935", AccentColor: "#FDD835"},

	// Drugstore
	{ID: "drug-recommend", Name: "おすすめ商品", Category: Drugstore, Pattern: Recommendation, Description: "ドラッグストアのおすすめ", PrimaryColor: "#1E88E5", AccentColor: "#E3F2FD"},
	{ID: "drug-limited", Name: "数量限定", Category: Drugstore, Pattern: Limited, Description: "数量限定品", PrimaryColor: "#7B1FA2", AccentColor: "#FFFFFF"},
	{ID: "drug-staff", Name: "薬剤師おすすめ", Category: Drugstore, Pattern: StaffPick, Description: "薬剤師のおすすめ商品", PrimaryColor: "#00838F", AccentColor: "#E0F7FA"},
	{ID: "drug-new", Name: "新商品入荷", Category: Drugstore, Pattern: NewArrival, Description: "新商品入荷のお知らせ", PrimaryColor: "#43A047", AccentColor: "#FFFFFF"},
	{ID: "drug-sale", Name: "ポイント2倍", Category: Drugstore, Pattern: Sale, Description: "ポイントアップセール", PrimaryColor: "#FB8C00", AccentColor: "#FFF3E0"},

	// Bookstore
	{ID: "book-recommend", Name: "今週のおすすめ", Category: Bookstore, Pattern: Recommendation, Description: "書店員のおすすめ本", PrimaryColor: "#5D4037", AccentColor: "#FFF8E1"},
	{ID: "book-limited", Name: "初版限定", Category: Bookstore, Pattern: Limited, Description: "初版限定・特典付き", PrimaryColor: "#C62828", AccentColor: "#FFEBEE"},
	{ID: "book-staff", Name: "書店員イチオシ", Category: Bookstore, Pattern: StaffPick, Description: "書店員が選ぶ一冊", PrimaryColor: "#1565C0", AccentColor: "#E3F2FD"},
	{ID: "book-new", Name: "新刊入荷", Category: Bookstore, Pattern: NewArrival, Description: "新刊入荷のお知らせ", PrimaryColor: "#2E7D32", AccentColor: "#E8F5E9"},
	{ID: "book-sale", Name: "フェア開催中", Category: Bookstore, Pattern: Sale, Description: "フェア・キャンペーン", PrimaryColor: "#E65100", AccentColor: "#FFF3E0"},
}

func All() []Template {
	return templates
}

func ByCategory(category string) []Template {
	var result []Template
	cat := Category(category)
	for _, t := range templates {
		if t.Category == cat {
			result = append(result, t)
		}
	}
	return result
}

func ByID(id string) (Template, bool) {
	for _, t := range templates {
		if t.ID == id {
			return t, true
		}
	}
	return Template{}, false
}
