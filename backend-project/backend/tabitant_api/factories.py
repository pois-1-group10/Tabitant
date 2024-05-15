from factory import Faker, PostGenerationMethodCall, SubFactory, RelatedFactory, LazyFunction
from faker import Factory as FakerFactory
from factory.django import DjangoModelFactory
from tabitant_api.models import *

faker = FakerFactory.create('ja_JP')

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = LazyFunction(faker.user_name)
    email = LazyFunction(faker.email)
    password = PostGenerationMethodCall("set_password", "password")

class PrefectureFactory(DjangoModelFactory):
    class Meta:
        model = Prefecture

    name = LazyFunction(faker.prefecture)

class PostFactory(DjangoModelFactory):
    class Meta:
        model = Post

    user = SubFactory(UserFactory)
    content_1 = LazyFunction(lambda: faker.text()[:5])
    content_2 = LazyFunction(lambda: faker.text()[:7])
    content_3 = LazyFunction(lambda: faker.text()[:5])
    content_4 = LazyFunction(lambda: faker.text()[:7])
    content_5 = LazyFunction(lambda: faker.text()[:7])
    latitude = Faker("latitude")
    longitude = Faker("longitude")
    prefecture = SubFactory(PrefectureFactory)
    detailed_place = LazyFunction(faker.address)
    emotion_ureshii = Faker("random_int", min=0, max=2)
    emotion_omoshiroi = Faker("random_int", min=0, max=2)
    emotion_odayaka = Faker("random_int", min=0, max=2)
    emotion_shimijimi = Faker("random_int", min=0, max=2)
    emotion_samishii = Faker("random_int", min=0, max=2)
    emotion_ikari = Faker("random_int", min=0, max=2)

class TagFactory(DjangoModelFactory):
    class Meta:
        model = Tag

    name = LazyFunction(faker.word)

class GoodFactory(DjangoModelFactory):
    class Meta:
        model = Good

    user = SubFactory(UserFactory)
    post = SubFactory(PostFactory)

class BadFactory(DjangoModelFactory):
    class Meta:
        model = Bad

    user = SubFactory(UserFactory)
    post = SubFactory(PostFactory)

class CommentFactory(DjangoModelFactory):
    class Meta:
        model = Comment

    user = SubFactory(UserFactory)
    post = SubFactory(PostFactory)
    parent_comment = None
    content = LazyFunction(faker.paragraph)
    created_at = LazyFunction(faker.date_time_this_year)
    updated_at = LazyFunction(faker.date_time_this_year)

class GoodCommentFactory(DjangoModelFactory):
    class Meta:
        model = GoodComment

    user = SubFactory(UserFactory)
    comment = SubFactory(CommentFactory)

class FollowFactory(DjangoModelFactory):
    class Meta:
        model = Follow

    follower = SubFactory(UserFactory)
    followee = SubFactory(UserFactory)

class UserProfileFactory(DjangoModelFactory):
    class Meta:
        model = UserProfile

    user = SubFactory(UserFactory)
    bio = LazyFunction(faker.paragraph)
    default_post = None

class CompetitionFactory(DjangoModelFactory):
    class Meta:
        model = Competition

    prefecture = SubFactory(PrefectureFactory)
    year = LazyFunction(faker.year)
    month = LazyFunction(faker.month)

class AwardFactory(DjangoModelFactory):
    class Meta:
        model = Award

    user = SubFactory(UserFactory)
    post = SubFactory(PostFactory)
    compe = SubFactory(CompetitionFactory)
    rank = Faker("random_int", min=1, max=10)
