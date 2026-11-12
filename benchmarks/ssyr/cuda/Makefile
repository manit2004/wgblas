CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/ssyr

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssyr: ssyr.c $(HDRS) | $(BIN)
	$(CC) ssyr.c -o $(BIN)/ssyr -lcublas

clean:
	rm -rf $(BIN)
