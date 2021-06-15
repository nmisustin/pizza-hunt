const { Comment, Pizza } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza with that id found' });
                    return;
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.json(err));
    },
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deleteComment => {
                if (!deleteComment) {
                    return res.status(404).json({ message: 'No comment with this id found' })
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza with this id found' });
                    return;
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.json(err));
    }
};

module.exports = commentController;